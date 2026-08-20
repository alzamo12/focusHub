import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";
import { userServices } from "../services/user.service.js";
import sendError from "../utils/sendError.js";
import sendResponse from "../utils/sendResponse.js";

export const handleCreateUser = async (req, res) => {

    try {
        // console.log(req.body)
        const result = await userServices.insertUserIntoDB(req.body);
        // res.send(result)
        sendResponse(res, 201, 'User created successfully', result)
    } catch (err) {
        // res.status(500).send({ message: "Error creating user" });
        // sendError(res, err.statusCode, err.message, err)
        console.log(err)
        res.status(err.statusCode).send({
            success: false,
            message: err.message,
            err: err
        })
    }
}

export const handleGetUsers = async (req, res) => {
    const usersCollection = await getCollection("users");
    try {
        const result = await usersCollection.find({}).toArray();
        res.send(result)
    } catch (err) {
        res.status(500).send({ message: "Error fetching users" });
    }
};

export const handleDeleteUser = async (req, res) => {
    const usersCollection = await getCollection("users");
    try {
        const { email } = req.params;
        const result = await usersCollection.deleteOne({email});
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: "Error deleting user" });
    }
};

export const handleUpdateUser = async (req, res) => {
    try {
        const result = await userServices.updateUserInDB(req.query.email, req.body);
        sendResponse(res, 200, 'User updated successfully', result)

    } catch (err) {
        console.log("PUT /users error:", err);
        sendError(res, err.statusCode, err.message, err)
    }
}

