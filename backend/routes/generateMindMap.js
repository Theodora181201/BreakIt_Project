import express from "express";
import fs from "fs";

import upload from "../middleware/upload.js";

import { validateInputs } from "../utils/validation.js";

import { extractText } from "../services/extractText.js";

import { generateMindMap } from "../services/geminiService.js";

import { convertToReactFlow } from "../services/reactFlowFormatter.js";

const router = express.Router();

router.post(

    "/generate-mindmap",

    upload.single("file"),

    async (req, res) => {

        try {

            const file = req.file;

            const userText = req.body.text || "";

            const error = validateInputs(userText, file);

            if (error) {

                return res.status(400).json({ error });

            }

            const extracted = await extractText(file);

            let combined = userText;

            if (extracted.text) {

                combined += `\n${extracted.text}`;

            }

            const result = await generateMindMap(
                combined,
                extracted.inlineData
            );

            const flow = convertToReactFlow(result.tree);

            res.json({
                summary: result.summary,
                nodes: flow.nodes,
                edges: flow.edges,
            });

        }

        // catch (err) {

        //     console.error("Mind map generation failed:", err);

        //     res.status(500).json({
        //         success: false,
        //         message: "Mind map generation failed.",
        //         details: err.message
        //     });

        // }
        catch (err) {

            console.error("================================");
            console.error("MIND MAP BACKEND ERROR");
            console.error(err);
            console.error(err.stack);
            console.error("================================");

            return res.status(500).json({
                success: false,
                message: "Mind map generation failed.",
                details: err.message
            });
        }

    }

);

export default router;