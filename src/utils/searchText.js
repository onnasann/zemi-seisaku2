export function normalizeSearchText(value = "") {
    return value
        .normalize("NFKC")
        .toLowerCase()
        .replace(/[ぁ-ゖ]/g, (character) =>
            String.fromCharCode(character.charCodeAt(0) + 0x60)
        )
        .replace(/\s+/g, "");
}
