import express from "express";
import { paymentControllers } from "../controllers/payment.controllers.js";

const router = express.Router();

router.post("/", paymentControllers.handleCreatePaymentIntent);

export default router