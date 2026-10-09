import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { handleGenerateNotes, handleGenerateQuestions, handleGenerateSummarize } from "../controllers/ai.controllers.js";
import { aiRateLimit } from "../middleware/aiRateLimit.js";
import { verifyEmail } from "../middleware/verifyEmail.js";
import upload from "../config/multer.js"

const router = express.Router();

router.post("/generate-questions", verifyToken, aiRateLimit, handleGenerateQuestions);
router.post("/generate-notes", verifyToken, aiRateLimit, handleGenerateNotes);
router.post("/summarize", verifyToken, upload.single("page"), handleGenerateSummarize);

export default router;