import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { handleGenerateQuestions } from "../controllers/ai.controllers.js";
import { tasksControllers } from "../controllers/task.controllers.js"
const router = express.Router();

router.get("/", verifyToken, tasksControllers.handleGetTasks);
router.post("/", verifyToken, tasksControllers.handleCreateTask);
router.patch("/:id", verifyToken, tasksControllers.handleUpdateTask);
router.delete("/:id", verifyToken, tasksControllers.handleDeleteTask);
router.get("/today", verifyToken, tasksControllers.handleGetTodayTask);
router.get("/month", verifyToken, tasksControllers.handleGetMonthTasks)
// router.delete("/", tasksControllers.handleDeleteAllTasks)
export default router;