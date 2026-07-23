// const tasksCollection = db?.collection("tasks");
import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";
import { todayDate } from "../utils/date.js";
import { getStartAndEndMonth } from "../utils/getStartAndEndMonth.js";
import { tasksService } from "../services/task.service.js";
import sendError from "../utils/sendError.js";
import sendResponse from "../utils/sendResponse.js";

const handleCreateTask = async (req, res) => {
    try {
        const result = await tasksService.insertTaskIntoDB(req?.body, req?.user?.email);
        // res.send(result)
        sendResponse(res, 201, 'task created successfully', result)
    }
    catch (err) {
        console.log(err)
        sendError(res, err.statusCode, err.message, err)
    }

};

const handleGetTasks = async (req, res) => {
    const tasksCollection = await getCollection("tasks");
    try {
        const result = await tasksService.getAllTasksFromDB(req.query);
        sendResponse(res, 200, 'tasks got successfully', result)

    } catch (err) {
        console.log(err)
        sendError(res, err.statusCode, err.message, err)

    }
};

const handleUpdateTask = async (req, res) => {
    try {
        const result = await tasksService.updateTaskInDB(req?.params?.id, req.body, req?.user?.email)
        sendResponse(res, 200, 'task updated successfully', result)

    } catch (err) {
        console.log(err);
        sendError(res, err.statusCode, err.message, err)

    }
}

const handleDeleteTask = async (req, res) => {
    try {
        const result = await tasksService.deleteTaskFromDB(req?.params?.id, req?.user?.email);
        sendResponse(res, 200, 'task deleted successfully', result)

    } catch (err) {
        console.error(err)
        sendError(res, err.statusCode, err.message, err)

    }
}

const handleGetTodayTask = async (req, res) => {
    try {
        const tasksCollection = await getCollection("tasks");

        const { today, tomorrow } = todayDate();

        const result = await tasksCollection
            .find({
                userEmail: req.user.email,
                date: {
                    $gte: today,
                    $lt: tomorrow
                },
            })
            .toArray();

        sendResponse(res, 200, 'today tasks got successfully', result)


    } catch (err) {
        console.log(err)
        sendError(res, err.statusCode, err.message, err)

    }
    finally {
        // console.log("Api is hit")

    }
};

const handleGetMonthTasks = async (req, res) => {
    try {
        const result = await tasksService.getThisMonthTasks(req.query, req.user.email);
        sendResponse(res, 200, 'this month tasks got successfully', result)

    } catch (err) {
        console.log(err)
        sendError(res, err.statusCode, err.message, err)

    }
};

const handleDeleteAllTasks = async (req, res) => {
    try {
        const result = await tasksService.deleteAllTasksFromDB();
        sendResponse(res, 200, 'tasks deleted successfully', result)

    } catch (err) {
        console.log(err)
        sendError(res, err.statusCode, err.message, err)

    }
};

export const tasksControllers = {
    handleCreateTask,
    handleGetTasks,
    handleUpdateTask,
    handleDeleteTask,
    handleGetMonthTasks,
    handleDeleteAllTasks,
    handleGetTodayTask
}