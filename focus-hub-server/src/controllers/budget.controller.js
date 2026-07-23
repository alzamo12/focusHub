import { getCollection } from "../config/db.js";
import { budgetServices } from "../services/budget.service.js";
import sendError from "../utils/sendError.js";
import sendResponse from "../utils/sendResponse.js";

export const handleUpsertBudget = async (req, res) => {
    try {
        const result = await budgetServices.updateBudgetInDB(req.body);
        sendResponse(res, 200, 'Budget updated successfully', result)
    } catch (err) {
        console.error(err);
        sendError(res, err.statusCode, err.message, err)
    }
};

export const handleGetBudget = async (req, res) => {
    try {
        const result = await budgetServices.getBudgetFromDB(req.query);

        sendResponse(res, 200, 'Budget got successfully', result)
    } catch (err) {
        console.error(err);
        sendError(res, err.statusCode, err.message, err)
    }
};

export const handleGetBudgets = async (req, res) => {
    const budgetsCollection = await getCollection("budgets");
    try {
        const result = await budgetsCollection.find({}).toArray();
        sendResponse(res, 200, 'Budgets got successfully', result)
    } catch (err) {
        console.error(err);

        sendError(res, err.statusCode, err.message, err)
    }
};