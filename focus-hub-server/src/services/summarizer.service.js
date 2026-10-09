import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js"
import { AppError } from "../utils/customError.js";

const handleGetSummarizationsFromDB = async (email) => {
    const summarizationCollection = await getCollection("summarizations");
    const result = await summarizationCollection.find({ email }).sort({ createdAt: -1 }).toArray();
    return result
};

const handleGetSummarizationByIdFromDB = async (id, email) => {
    const summarizationCollection = await getCollection("summarizations");

    if (!ObjectId.isValid(id)) {
        // return res.status(400).json({ message: "Invalid material ID." });
        throw new AppError(400, "Invalid Material ID")
    }

    const query = { _id: new ObjectId(id), email };
    const result = await summarizationCollection.findOne(query);
    return result;

};

const handleDeleteSummarizationFromDB = async (id, email) => {
    const summarizationCollection = await getCollection("summarizations");
    if (!ObjectId.isValid(id)) {
        throw new AppError(400, "Invalid Material ID")
    }
    const query = {
        _id: new ObjectId(id),
        email
    }
    const result = await summarizationCollection.deleteOne(query);
    return result;
}

export const summarizerService = {
    handleGetSummarizationsFromDB,
    handleGetSummarizationByIdFromDB,
    handleDeleteSummarizationFromDB
}