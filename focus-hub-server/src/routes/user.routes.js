import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyEmail } from "../middleware/verifyEmail.js";
import { handleCreateUser, handleGetUsers, handleDeleteUser } from "../controllers/user.controllers.js";
const router = express.Router();

router.get("/",  handleGetUsers);
router.post("/", handleCreateUser);
// router.patch("/:id", verifyToken, handleUpdateUser);
router.delete("/:id", verifyToken, handleDeleteUser);

export default router;