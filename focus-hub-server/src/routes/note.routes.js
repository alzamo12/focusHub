import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyEmail } from "../middleware/verifyEmail.js";
import {handleCreateNote, handleDeleteNote, handleGetNotes, handleUpdateNote, handleGetSingleNote} from "../controllers/note.controllers.js";

const router = express.Router();

router.get("/", verifyToken,verifyEmail, handleGetNotes);
router.get("/:id", verifyToken, handleGetSingleNote);
router.post("/", verifyToken, handleCreateNote);
router.patch("/:id", verifyToken, handleUpdateNote);
router.delete("/:id", verifyToken, handleDeleteNote);

export default router;