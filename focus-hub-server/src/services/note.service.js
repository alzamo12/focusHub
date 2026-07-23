import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";
import sanitizeHtml from "sanitize-html";
import { AppError } from "../utils/customError.js"
const getNotesFromDB = async (reqQuery) => {
    const notesCollection = await getCollection("notes");

    const { email, subject, page = 1, limit = 5 } = reqQuery;
    const query = { userEmail: email };
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const skip = (pageNum - 1) * limitNum;

    // console.log(typeof subject)
    if (subject && subject.toLowerCase() !== "undefined" && subject.toLowerCase() !== "null") {
        if (subject.toLowerCase() !== "all") {
            query.subject = subject;
        }
    }
    // console.log(query)
    const notesData = await notesCollection.find(query,
        { projection: { content: 0 } }).sort({ createdAt: -1 }).skip(skip).limit(limitNum).toArray();
    // console.log(notesData[0])
    const notesCount = await notesCollection.countDocuments(query, { hint: "_id_" })
    const totalPages = parseInt(Number(notesCount) / limitNum) || 1;
    const result = {
        notesData,
        totalPages
    };
    return result
};

const getSingleNoteFromDB = async (id, userEmail) => {
    const notesCollection = await getCollection("notes");

    const query = {
        _id: new ObjectId(id),
        userEmail: userEmail,
    };

    const result = await notesCollection.findOne(query);

    if (!result) {
        throw new AppError(404, 'Note not found')
    }
    return result
}

const insertNoteIntoDB = async (data, userEmail) => {
    const notesCollection = await getCollection("notes");

    const { content, title, subject } = data;

    const cleanHTML = sanitizeHtml(content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        allowedAttributes: {
            a: ["href", "name", "target"],
            img: ["src", "alt"],
            "*": ["style"],
        },
    });

    const noteData = {
        title,
        subject,
        content: cleanHTML,
        userEmail: userEmail,
        createdAt: new Date(),
    };

    const result = await notesCollection.insertOne(noteData);
    return result
};

const deleteNoteFromDB = async (id, userEmail) => {
    const notesCollection = await getCollection("notes");

    const query = {
        _id: new ObjectId(id),
        userEmail: userEmail,
    };

    const result = await notesCollection.deleteOne(query);
    if (result?.deletedCount <= 0) {
        throw new AppError(404, 'Note not found')
    }
    return result
};

const updateNoteInDB = async (id, noteData, userEmail) => {
    const notesCollection = await getCollection("notes");

    const { content, title, subject } = noteData;

    const cleanHTML = sanitizeHtml(content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        allowedAttributes: {
            a: ["href", "name", "target"],
            img: ["src", "alt"],
            "*": ["style"],
        },
    });

    const query = {
        _id: new ObjectId(id),
        userEmail: userEmail,
    };

    const updatedDoc = {
        $set: {
            title,
            subject,
            content: cleanHTML,
            updatedAt: new Date(),
        },
    };

    const result = await notesCollection.updateOne(query, updatedDoc);
    if (result.matchedCount === 0) {
        throw new AppError(404, 'not authorized or note could not find')
    }
    return result
}

export const noteServices = {
    getNotesFromDB,
    insertNoteIntoDB,
    deleteNoteFromDB,
    getSingleNoteFromDB,
    updateNoteInDB
}