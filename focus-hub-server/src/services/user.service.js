import { getCollection } from "../config/db.js";
import { AppError } from "../utils/customError.js"
import { validateUser } from "../utils/validateUser.js";
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

const updateUserInDB = async (email, userData) => {
    const usersCollection = await getCollection("users");

    const normalizedEmail = email.trim().toLowerCase();

    const updatedData = {
        email: normalizedEmail,
        updatedAt: new Date(),
    };

    if (userData.name !== undefined && userData.name !== null) {
        updatedData.name = userData.name.trim();
    };

    if (userData.photo !== undefined && userData.photo !== null) {
        updatedData.photo = userData.photo.trim();
    };

    if (userData.password !== undefined) {
        updatedData.password = userData.password;
    };

    const result = await usersCollection.updateOne(
        {
            email: normalizedEmail,
        },
        {
            $set: updatedData,
        }
    );

    return result;
}


export const userServices = {
    insertUserIntoDB,
    updateUserInDB

}
