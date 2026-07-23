import { getCollection } from "../config/db.js";
import { AppError } from "../utils/customError.js"

const getBudgetFromDB = async (reqQuery) => {
    const budgetsCollection = await getCollection("budgets");

    const { email, month } = reqQuery;;

    if (!email || !month) {

        throw new AppError(400, 'email and month are required')
    }

    const query = {
        userEmail: email,
        month
    };

    const result = await budgetsCollection.findOne(query);
    return result;
};

const updateBudgetInDB = async (budgetData) => {
    const budgetsCollection = await getCollection("budgets");

    const { amount, userEmail, month } = budgetData;
    // console.log('budget', amount, userEmail, month)
    if (!month || !userEmail || !amount) {
        throw new AppError(400, "Invalid query")
    }

    const filter = { userEmail, month };

    const updatedDoc = {
        $set: {
            amount,
            updatedAt: new Date()
        },
        $setOnInsert: {
            createdAt: new Date()
        }
    };

    const options = { upsert: true };

    const result = await budgetsCollection.updateOne(
        filter,
        updatedDoc,
        options
    );

    // if (result.matchedCount === 0) {
    //     throw new AppError(404, 'not authorized or budget could not find')
    // }
    return result
}

export const budgetServices = {
    getBudgetFromDB,
    updateBudgetInDB
}