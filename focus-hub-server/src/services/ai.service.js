import { GoogleGenAI } from "@google/genai";
import config from "../config/env.js";
const ai = new GoogleGenAI({ apiKey: config.gemini_api_key });

export const generateQuestionsOrNotes = async (prompt) => {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 0 },
        }
    });
    return response.text;
};

export const generateSummarization = async (prompt, base64Image) => {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
            {
                role: "user",
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: base64Image,
                        },
                    },
                ],
            },
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    title: { type: "STRING" },
                    subject: { type: "STRING" },
                    summary: { type: "STRING" },
                    flashcards: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                question: { type: "STRING" },
                                answer: { type: "STRING" },
                            },
                            required: ["question", "answer"],
                        },
                    },
                    definitions: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                term: { type: "STRING" },
                                meaning: { type: "STRING" },
                            },
                            required: ["term", "meaning"],
                        },
                    },
                    keywords: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                word: { type: "STRING" },
                                explanation: { type: "STRING" },
                            },
                            required: ["word", "explanation"],
                        },
                    },
                    warnings: {
                        type: "ARRAY",
                        items: { type: "STRING" },
                    },
                },
                required: [
                    "title",
                    "subject",
                    "summary",
                    "flashcards",
                    "definitions",
                    "keywords",
                    "warnings",
                ],
            },
        },
    });
    return response;
}