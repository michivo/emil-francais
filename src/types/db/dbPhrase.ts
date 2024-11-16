export interface DbPhrase {
    userId: string;
    id: string;
    primaryLanguageId: string;
    secondaryLanguageId: string;
    primaryPhrase: string;
    secondaryPhrase: string;
    active: boolean;
}