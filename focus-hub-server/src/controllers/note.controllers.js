import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";
import sanitizeHtml from "sanitize-html";
import { noteServices } from "../services/note.service.js";
// import { database } from "firebase-admin";
import sendError from "../utils/sendError.js";
import sendResponse from "../utils/sendResponse.js";

export const handleGetNotes = async (req, res) => {
    try {
        const result = await noteServices.getNotesFromDB(req.query);
        // res.send(result)
        sendResponse(res, 200, 'Notes got successfully', result)

    } catch (err) {
        console.log(err)
        sendError(res, err.statusCode, err.message, err)
    }
};

export const handleCreateNote = async (req, res) => {
    try {

        const result = await noteServices.insertNoteIntoDB(req.body, req?.user?.email);
        // res.send(result);
        sendResponse(res, 201, 'Note created successfully', result)

    } catch (err) {
        console.error(err);
        sendError(res, err.statusCode, err.message, err)

    }
};

// Delete Note
export const handleDeleteNote = async (req, res) => {
    try {

        const result = await noteServices.deleteNoteFromDB(req.params.id, req.user.email);
        sendResponse(res, 200, 'Note deleted successfully', result)

    } catch (err) {
        console.error(err);
        sendError(res, err.statusCode, err.message, err)

    }
};

// Get Single Note
export const handleGetSingleNote = async (req, res) => {
    const notesCollection = await getCollection("notes");

    try {
        const result = await noteServices.getSingleNoteFromDB(req.params.id, req.user.email)
        sendResponse(res, 200, 'Note got successfully', result)
    } catch (err) {
        console.error(err);
        // res.status(500).json({ error: "Internal Server Error" });
        sendError(res, err.statusCode, err.message, err)

    }
};

// Update Note
export const handleUpdateNote = async (req, res) => {
    try {
        const result = noteServices.updateNoteInDB(req.params.id, req.body, req.user.email);
        sendResponse(res, 200, 'Note updated successfully', result)

    } catch (err) {
        console.error(err);
        sendError(res, err.statusCode, err.message, err)

    }
};