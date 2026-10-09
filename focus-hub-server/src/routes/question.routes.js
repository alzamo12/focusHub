import express from "express";
import { acceptAnswerController, addAnswerController, createQuestionController, getQuestionController, getQuestionsController } from "../controllers/question.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../config/multer.js";
const router = express.Router();

// Public routes
router.get("/", getQuestionsController);
router.get("/:id", getQuestionController);

// Authenticated routes
router.post(
    "/",
    verifyToken,
    upload.single("image"),
    createQuestionController
);

router.post("/:id/answers", verifyToken, addAnswerController);

router.patch(
    "/:id/accepted-answer",
    verifyToken,
    acceptAnswerController
);

export default router