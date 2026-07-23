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
        const { id } = req.params;
        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: "Error deleting user" });
    }
};