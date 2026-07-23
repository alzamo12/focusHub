import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { handleGenerateNotes, handleGenerateQuestions } from "../controllers/ai.controllers.js";
import { aiRateLimit } from "../middleware/aiRateLimit.js";
import { verifyEmail } from "../middleware/verifyEmail.js";


const router = express.Router();

router.post("/generate-questions", verifyToken, aiRateLimit, handleGenerateQuestions);
router.post("/generate-notes", verifyToken, aiRateLimit, handleGenerateNotes);
export default router;