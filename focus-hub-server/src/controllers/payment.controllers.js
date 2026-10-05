import { paymentServices } from "../services/payment.service.js";
import sendError from "../utils/sendError.js";
import sendResponse from "../utils/sendResponse.js";
const handleCreatePaymentIntent = async (req, res) => {
    try {
        const result = await paymentServices.createPaymentIntentIntoDB(req.body);
        sendResponse(res, 200, "Payment intent created successfully", result);
    } catch (err) {
        sendError(res, 500, "Error creating payment intent", err);
    }
};

export const paymentControllers = {
    handleCreatePaymentIntent
};