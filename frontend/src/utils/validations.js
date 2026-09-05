export const validateInputs = (text, file, setError) => {
    setError(null);

    // 1. Word Count Check
    if (text) {
        const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount > 5000) {
            setError(`Text exceeds the limit! Maximum allowed is 5,000 words. (You have ${wordCount})`);
            return false;
        }
    }

    // 2. File Checks
    if (file) {
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        if (file.size > MAX_FILE_SIZE) {
            setError("File is too large! Maximum allowed size is 10MB.");
            return false;
        }

        const allowedTypes = [
            'text/plain',
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/webp',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];

        if (!allowedTypes.includes(file.type)) {
            setError("Unsupported file format! Please upload a TXT, PDF, Word doc, PowerPoint presentation, or standard Image.");
            return false;
        }
    }

    return true; 
};