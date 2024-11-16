import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firebaseDb } from "./firebase";
import type { DbPhrase } from "../types/db/dbPhrase";
import type { Phrase } from "../types/phrase";
import { language } from "../stores/language";
import { fromStore } from "svelte/store";
import { currentUser } from "../stores/currentUser";

const collectionName = 'phrases';

type PhraseDoc = Partial<DbPhrase>;

export async function getPhrases(includeInactive = false): Promise<Phrase[]> {
    const database = firebaseDb;
    const phrasesRef = collection(database, collectionName);
    const user = fromStore(currentUser);
    const userId = user.current.user?.uid;
    const currentLanguage = fromStore(language);
    const phrasesQuery = includeInactive ? query(phrasesRef,
        where('userId', '==', userId),
        where('primaryLanguageId', '==', currentLanguage.current.primary),
        where('secondaryLanguageId', '==', currentLanguage.current.secondary)) :
        query(phrasesRef,
            where('userId', '==', userId),
            where('active', '==', true),
            where('primaryLanguageId', '==', currentLanguage.current.primary),
            where('secondaryLanguageId', '==', currentLanguage.current.secondary));

    const phrasesQuerySnapshot = await getDocs(phrasesQuery);
    const response = [] as Phrase[];
    phrasesQuerySnapshot.forEach((doc) => {
        const phrase = doc.data() as DbPhrase;
        response.push({
            id: doc.id,
            primary: phrase.primaryPhrase,
            secondary: phrase.secondaryPhrase,
            active: phrase.active,
        });
    });
    return response;
}

export async function addPhrase(phrase: Phrase) {
    const phraseDoc: PhraseDoc = toDbPhrase(phrase);
    const database = firebaseDb;
    const ref = await addDoc(collection(database, collectionName), phraseDoc);
    phrase.id = ref.id;
}

export async function deletePhrase(phrase: Phrase) {
    if (phrase.id === undefined) {
        throw new Error('Phrase must have an id to be updated');
    }
    deleteDoc(doc(firebaseDb, collectionName, phrase.id));
}

export async function updatePhrase(phrase: Phrase) {
    if (phrase.id === undefined) {
        throw new Error('Phrase must have an id to be updated');
    }
    const dbPhrase = toDbPhrase(phrase);
    const database = firebaseDb;
    const phraseRef = doc(database, collectionName, phrase.id);
    await updateDoc(phraseRef, dbPhrase);
}

function toDbPhrase(phrase: Phrase) {
    const currentLanguage = fromStore(language);
    const user = fromStore(currentUser);
    const phraseDoc: PhraseDoc = {
        primaryPhrase: phrase.primary,
        secondaryPhrase: phrase.secondary,
        primaryLanguageId: currentLanguage.current.primary,
        secondaryLanguageId: currentLanguage.current.secondary,
        userId: user.current.user?.uid,
        active: phrase.active,
    };
    return phraseDoc;
}