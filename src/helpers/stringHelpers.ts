export function areAlike(s1: string, s2: string) {
    const s1Simple = simplify(s1).toLowerCase().normalize();
    const s2Simple = simplify(s2).toLowerCase().normalize();

    return s1Simple === s2Simple;
}

function simplify(phrase: string) {
    return phrase
        .replace(/Â|À|Å|Ã/g, "A")
        .replace(/â|à|å|ã/g, "a")
        .replace(/Ä/g, "AE")
        .replace(/ä/g, "ae")
        .replace(/Ç/g, "C")
        .replace(/ç/g, "c")
        .replace(/É|Ê|È|Ë/g, "E")
        .replace(/é|ê|è|ë/g, "e")
        .replace(/Ó|Ô|Ò|Õ|Ø/g, "O")
        .replace(/ó|ô|ò|õ/g, "o")
        .replace(/Ö/g, "OE")
        .replace(/ö/g, "oe")
        .replace(/Š/g, "S")
        .replace(/š/g, "s")
        .replace(/ß/g, "ss")
        .replace(/Ú|Û|Ù/g, "U")
        .replace(/ú|û|ù/g, "u")
        .replace(/Ü/g, "UE")
        .replace(/ü/g, "ue")
        .replace(/Ý|Ÿ/g, "Y")
        .replace(/ý|ÿ/g, "y")
        .replace(/Ž/g, "Z")
        .replace(/ž/, "z")
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,'');
}