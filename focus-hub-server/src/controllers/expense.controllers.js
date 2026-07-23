import { getCollection } from "../config/db.js";
import { expenseServices } from "../services/expense.service.js";
import sendResponse from "../utils/sendResponse.js";

export const handleCreateExpense = async (req, res) => {
    try {
        const result = await expenseServices.insertExpenseIntoDB(req.body);
        // res.send(result)
        sendResponse(req, 201, 'Expense created successfully', result)
    }
    catch (err) {
        console.log(err)
        sendError(res, err.statusCode, err.message, err)
    }
}

export const handleGetExpenses = async (req, res) => {
    try {
        const result = await expenseServices.getExpensesFromDB(req.query, req.user.email)
        // res.send(result)
        sendResponse(res, 200, 'Expenses got successfully', result)
    } catch (err) {
        console.log(err)
        sendError(res, err.statusCode, err.message, err)
    }
};