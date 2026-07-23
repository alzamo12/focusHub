import { getCollection } from "../config/db.js";
import { AppError } from "../utils/customError.js"

const getExpensesFromDB = async (reqQuery, userEmail) => {
    const expensesCollection = await getCollection("expenses");
    const { budgetId } = reqQuery;
    // const email = req.user.email;
    const query = { userEmail: userEmail };
    if (budgetId) {
        query.budgetId = budgetId
    } else {
        throw new AppError(400, 'BudgetId is required')
    }

    const result = await expensesCollection.find(query).toArray();
    return result;
};

const insertExpenseIntoDB = async (expenseData) => {
    const expensesCollection = await getCollection("expenses");
    const result = await expensesCollection.insertOne(expenseData);
    return result
}

export const expenseServices = {
    getExpensesFromDB,
    insertExpenseIntoDB
}