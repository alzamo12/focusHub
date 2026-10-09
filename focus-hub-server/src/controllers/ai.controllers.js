import { generateQuestionsOrNotes, generateSummarization } from "../services/ai.service.js";
import { generateNotesPrompt, generateQuestionsPrompt, generateSummarizationPrompt } from "../prompt.js";
import sendResponse from "../utils/sendResponse.js";
import sendError from "../utils/sendError.js";
import { AppError } from "../utils/customError.js"
import { validateStudyMaterial } from "../utils/summarizeValidation.js";
import { getCollection } from "../config/db.js";
import multer from "multer";
import sharp from "sharp";

export const handleGenerateQuestions = async (req, res) => {
    try {
        const { subject, chapter, level, type, subTopic, language } = req.body;

        if (!subject || !chapter || !level || !type || !subTopic || !language) {
            throw new AppError(404, 'invalid information')
        }

        const prompt = generateQuestionsPrompt(
            subject,
            chapter,
            level,
            type,
            subTopic,
            language
        );

        const result = await generateQuestionsOrNotes(prompt);

        sendResponse(res, 200, 'Questions generated successfully', result)
    } catch (err) {
        sendError(res, 500, "Internal server error", err)
    }
};

export const handleGenerateNotes = async (req, res) => {
    // console.log(req.body);
    try {
        const { subject, chapter, subTopic, level, language } = req.body;
        if (!subject || !chapter || !subTopic || !level || !language) {
            throw new AppError(404, 'Invalid Information')
        };

        const prompt = generateNotesPrompt(
            subject,
            chapter,
            subTopic,
            level,
            language
        );

        const result = await generateQuestionsOrNotes(prompt);
        sendResponse(res, 200, "Note created successfully", result)
    } catch (err) {
        console.log(err);
        sendError(res, err.statusCode, 'Internal Server Error', err)
    }
};

export const handleGenerateSummarize = async (req, res) => {
    try {
        const summarizationCollection = await getCollection("summarizations");
        console.log("api hit generate summarize");
        // console.log(req.file)
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a page image.",
            });
        }

        // Normalize and resize the image before sending it to Gemini.
        const processedImage = await sharp(req.file.buffer)
            .rotate()
            .resize({
                width: 2000,
                height: 2000,
                fit: "inside",
                withoutEnlargement: true,
            })
            .jpeg({ quality: 85 })
            .toBuffer();

        const base64Image = processedImage.toString("base64");
        const prompt = generateSummarizationPrompt();
        const response = await generateSummarization(prompt, base64Image);

        if (!response.text) {
            throw new Error("Gemini returned an empty response.");
        }

        const generated = validateStudyMaterial(
            JSON.parse(response.text)
        );

        // Do not save an image that Gemini says could not be analyzed.
        if (generated.warnings.length > 0 &&
            generated.flashcards.length === 0 &&
            generated.definitions.length === 0 &&
            generated.keywords.length === 0) {
            return res.status(422).json({
                message: "The page could not be analyzed. Try a clearer image.",
                warnings: generated.warnings,
            });
        }

        const document = {
            ...generated,
            // userId: req.user.uid,
            email: req.user.email,
            source: "image",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await summarizationCollection.insertOne(document);

        return res.status(201).send({
            message: "Study material generated successfully.",
            material: {
                ...document,
                _id: result.insertedId,
            },
        });
    } catch (error) {
        console.error("Study material generation failed:", error.message);

        if (error instanceof multer.MulterError) {
            return res.status(400).json({
                message:
                    error.code === "LIMIT_FILE_SIZE"
                        ? "Image must be smaller than 8 MB."
                        : "Invalid image upload.",
            });
        }

        if (error.message?.includes("Unsupported image")) {
            return res.status(400).json({
                message: "The image file is invalid or unsupported.",
            });
        }

        if (error.status === 429 || error.status === 503) {
            return res.status(503).json({
                message: "AI service is busy or its quota is exhausted. Try later.",
            });
        }

        return res.status(500).json({
            message: "Unable to generate study material right now.",
        });
    }
}