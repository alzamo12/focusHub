export function validateStudyMaterial(data) {
    if (
        !data ||
        typeof data.title !== "string" ||
        typeof data.subject !== "string" ||
        typeof data.summary !== "string" ||
        !Array.isArray(data.flashcards) ||
        !Array.isArray(data.definitions) ||
        !Array.isArray(data.keywords) ||
        !Array.isArray(data.warnings)
    ) {
        throw new Error("Gemini returned an invalid study-material format.");
    }

    const validPairs = (items, first, second, max) =>
        items.length <= max &&
        items.every(
            (item) =>
                item &&
                typeof item[first] === "string" &&
                typeof item[second] === "string" &&
                item[first].trim() &&
                item[second].trim()
        );

    if (
        !validPairs(data.flashcards, "question", "answer", 12) ||
        !validPairs(data.definitions, "term", "meaning", 10) ||
        !validPairs(data.keywords, "word", "explanation", 12) ||
        !data.warnings.every((warning) => typeof warning === "string")
    ) {
        throw new Error("Gemini returned invalid study-material fields.");
    }

    return data;
}