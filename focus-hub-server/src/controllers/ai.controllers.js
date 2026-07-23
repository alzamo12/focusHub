import { generateQuestionsOrNotes } from "../services/ai.service.js";
import { generateNotesPrompt, generateQuestionsPrompt } from "../prompt.js";
import sendResponse from "../utils/sendResponse.js";
import sendError from "../utils/sendError.js";
import { AppError } from "../utils/customError.js"
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