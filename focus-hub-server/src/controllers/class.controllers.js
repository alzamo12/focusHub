import { getCollection } from "../config/db.js";
import { ObjectId } from "mongodb";
import { todayDate } from "../utils/date.js";
import { getStartAndEndMonth } from "../utils/getStartAndEndMonth.js";
import { cloneElement } from "react";
import { classesServices } from "../services/class.service.js";
import sendResponse from "../utils/sendResponse.js";
import sendError from "../utils/sendError.js";


// get all classes of a user
export const handleGetClasses = async (req, res) => {
    /* 
    NOTE --> 1. view has 2 values = flat and group
             2. type has 2 values = next and prev
             3. email is the value of the email from query email=.gmail.com
    */
    try {
        const result = await classesServices.getClassesFromDB(req.query);
        // res.send(result);
        sendResponse(res, 200, 'Classes got successfully', result)
    }
    catch (err) {
        console.log(err)
        sendError(res, err.statusCode, err.message, err)
    }
};

// create a class
export const handleCreateClass = async (req, res) => {
    // get classes collection

    try {
        // get the query and user email
        const result = await classesServices.createClassIntoDB(req?.body, req?.user?.email);

        // res.send(result)
        sendResponse(res, 201, 'Class created successfully', result)

    }
    catch (err) {
        console.log(err)
        sendError(res, err.statusCode, err.message, err)

    }
    finally {
        // console.log('class api hitter')
    }
};

// update a class
export const handleUpdateClass = async (req, res) => {
    try {
        const result = await classesServices.updateClassInDB(req?.params?.id, req?.body, req?.user?.email);
        // res.send(result)
        sendResponse(res, 200, 'Class updated successfully', result)

    }
    catch (err) {
        console.log(err)
        if (err.errors) {
            return res.status(400).json({ errors: err.errors });
        };

        sendError(res, err.statusCode, err.message, err)

    }
};

// delete a class
export const handleDeleteClass = async (req, res) => {
    try {
        const result = await classesServices.deleteClassFromDB(req?.params?.id, req.user.email);
        // res.status(200).send(result);
        sendResponse(res, 200, 'Class deleted successfully', result)

    } catch (err) {
        console.log(err)
        sendError(res, err.statusCode, err.message, err)

    }
};

export const handleGetTodayClass = async (req, res) => {
    const classesCollection = await getCollection("classes");
    try {
        // console.log("classes today api hit")
        const { today, tomorrow } = todayDate();
        const now = new Date();
        // console.log('now', now)
        // console.log('tomorrow', tomorrow)
        const result = await classesCollection
            .find({
                userEmail: req.user.email,
                date: {
                    $gte: today,
                    $lt: tomorrow
                }
            })
            .toArray();

        // res.send(result);
        sendResponse(res, 200, 'Class got successfully', result)

    } catch (err) {
        console.log(err)
        sendError(res, err.statusCode, err.message, err)

    }
};

// dashboard month cls get api
export const handleGetMonthClass = async (req, res) => {
    try {
        const result = await classesServices.getThisMonthClassesFromDB(req.query, req?.user?.email);
        // res.status(200).send(result);
        sendResponse(res, 200, 'This month Classes got successfully', result)

    } catch (err) {
        console.log(err)
        sendError(res, err.statusCode, err.message, err)

    }
};

export const handleDeleteAllClasses = async (req, res) => {
    try {
        const result = await classesServices.deleteAllClassesFromDB();
        sendResponse(res, 200, 'Classes deleted successfully', result)
    } catch (err) {
        console.log(err)
        sendError(res, err.statusCode, err.message, err)

    }

};