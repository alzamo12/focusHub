import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyEmail } from "../middleware/verifyEmail.js";
import {
    handleGetClasses,
    handleCreateClass,
    handleDeleteClass,
    handleUpdateClass,
    handleGetTodayClass,
    handleGetMonthClass,
    handleDeleteAllClasses
} from "../controllers/class.controllers.js";

const router = express.Router();

router.get("/", verifyToken, verifyEmail, handleGetClasses);
router.post("/", verifyToken, handleCreateClass);
router.patch("/:id", verifyToken, handleUpdateClass);
router.delete("/:id", verifyToken, handleDeleteClass);
router.get("/today", verifyToken, handleGetTodayClass);
router.get("/month", verifyToken, handleGetMonthClass)
// router.delete("/",handleDeleteAllClasses )

export default router;