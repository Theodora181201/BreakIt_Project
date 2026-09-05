import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

import { SYSTEM_PROMPT } from "../utils/prompts.js";
import { repairJson } from "../utils/jsonRepair.js";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export async function generateMindMap(text, inlineData) {

    const contents = [];

    if (inlineData) {

        contents.push({
            inlineData
        });

    }

    contents.push(`${SYSTEM_PROMPT}

Study Material:

${text}`);

    let lastError = null;

    // retry one more time when invalid -> make it more robust
    for (let attempt = 1; attempt <= 2; attempt++) {

        try {

            const response = await ai.models.generateContent({

                model: "gemini-3.6-flash",

                contents

            });

            const repaired = repairJson(response.text);

            const parsed = JSON.parse(repaired);

            return {

                summary: parsed.summary || "",

                tree: parsed

            };

        }

        catch (err) {

            lastError = err;

            console.log(`Retry ${attempt}...`);

        }

    }

    throw lastError;

}