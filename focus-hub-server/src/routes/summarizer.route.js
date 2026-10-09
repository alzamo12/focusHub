import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyEmail } from "../middleware/verifyEmail.js";
import { summarizerControllers } from "../controllers/summarizer.controller.js";

const router = express.Router();

router.get("/", verifyToken, verifyEmail, summarizerControllers.handleGetSummarizations);
router.get("/:id", verifyToken, summarizerControllers.handleGetSummarizationById);
router.delete("/:id", verifyToken,summarizerControllers.handleDeleteSummarizations )

export default router
// router