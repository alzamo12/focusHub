import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyEmail } from "../middleware/verifyEmail.js";
import { handleGenerateQuestions } from "../controllers/ai.controllers.js";
import { handleGetBudget, handleGetBudgets, handleUpsertBudget } from "../controllers/budget.controller.js";
const router = express.Router();

router.put(
    "/",
    verifyToken,
    handleUpsertBudget
);

router.get(
    "/",
    verifyToken,
    verifyEmail,
    handleGetBudget
);

router.get(
    "/all",
    handleGetBudgets
);


export default router;