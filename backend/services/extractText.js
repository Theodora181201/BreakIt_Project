import fs from "fs";
import mammoth from "mammoth";
import officeParser from "officeparser";
import pdf from "pdf-parse";

export async function extractText(file) {

    if (!file) {
        return {
            text: "",
            inlineData: null
        };
    }

    const mime = file.mimetype;

    // Images
    if (mime.startsWith("image/")) {

        return {
            text: "",
            inlineData: {
                data: fs.readFileSync(file.path).toString("base64"),
                mimeType: mime
            }
        };

    }

    // PDF
    if (mime === "application/pdf") {

        const buffer = fs.readFileSync(file.path);

        const parsed = await pdf(buffer);

        return {
            text: parsed.text,
            inlineData: null
        };

    }

    // TXT
    if (mime === "text/plain") {

        return {
            text: fs.readFileSync(file.path, "utf8"),
            inlineData: null
        };

    }

    // DOCX
    if (
        mime ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {

        const result = await mammoth.extractRawText({
            path: file.path
        });

        return {
            text: result.value,
            inlineData: null
        };

    }

    // PPTX
    if (
        mime ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {

        const pptText =
            await officeParser.parseOfficeAsync(file.path);

        return {
            text: pptText,
            inlineData: null
        };

    }

    throw new Error("Unsupported file type.");
}