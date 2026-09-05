export function repairJson(text) {

    let cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    // Remove anything before the first {
    const firstBrace = cleaned.indexOf("{");
    if (firstBrace !== -1) {
        cleaned = cleaned.substring(firstBrace);
    }

    // Remove anything after the last }
    const lastBrace = cleaned.lastIndexOf("}");
    if (lastBrace !== -1) {
        cleaned = cleaned.substring(0, lastBrace + 1);
    }

    return cleaned;
}