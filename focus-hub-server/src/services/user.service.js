import { getCollection } from "../config/db.js";
import { AppError } from "../utils/customError.js"

const insertUserIntoDB = async (user) => {
    const usersCollection = await getCollection("users");

    const { email } = user;
    // const email = user?.email;
    // console.log(email)
    const isExist = await usersCollection.findOne({ email: email });
    if (isExist) {
        throw new AppError(400, 'User already Exist. Please login instead')
    }

    const userData = {
        ...user,
        createdAt: new Date()
    };
    const result = await usersCollection.insertOne(userData);
    return result
}


export const userServices = {
    insertUserIntoDB

}