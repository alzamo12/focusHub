import { GoogleGenAI } from "@google/genai";
import config from "../config/env.js";
const ai = new GoogleGenAI({ apiKey: config.gemini_api_key });

export const generateQuestionsOrNotes = async (prompt) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 0 },
        }
    });
    return response.text;
};