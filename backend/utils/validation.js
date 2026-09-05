export const validateInputs = (text, file) => {

    if (text) {

        const words = text
            .trim()
            .split(/\s+/)
            .filter(Boolean).length;

        if (words > 5000) {

            return "Maximum 5000 words allowed.";

        }

    }

    if (file) {

        const MAX_SIZE = 10 * 1024 * 1024;

        if (file.size > MAX_SIZE) {

            return "Maximum upload size is 10MB.";

        }

        const allowedTypes = [

            "text/plain",

            "application/pdf",

            "image/jpeg",

            "image/png",

            "image/webp",

            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

            "application/vnd.openxmlformats-officedocument.presentationml.presentation"

        ];

        if (!allowedTypes.includes(file.mimetype)) {

            return "Unsupported file format.";

        }

    }

    return null;

};