import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyEmail } from "../middleware/verifyEmail.js";
import { handleGenerateQuestions } from "../controllers/ai.controllers.js";
import { handleGetExpenses, handleCreateExpense } from "../controllers/expense.controllers.js";

const router = express.Router();

router.get("/", verifyToken, handleGetExpenses);
router.post("/", verifyToken, handleCreateExpense);

export default router;