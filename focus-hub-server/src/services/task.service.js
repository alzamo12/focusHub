import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js"
import { getStartAndEndMonth } from "../utils/getStartAndEndMonth.js";
import { AppError } from "../utils/customError.js";

const insertTaskIntoDB = async (taskData, userEmail) => {
    const tasksCollection = await getCollection("tasks");

    const { endTime, startTime, date, ...data } = taskData;
    const newStart = new Date(startTime);
    const newEnd = new Date(endTime);
    // const userEmail = req.user.email;
    // 1. start time is after endtime or invalid time return 
    if (newStart >= newEnd) {
        throw new AppError(400, 'End time can not be before start time')
    }

    // 2. check if the class schedule overlaps
    const doesOverlap = await tasksCollection?.findOne({
        userEmail: userEmail,
        $or: [
            {
                startTime: { $lt: newEnd },
                endTime: { $gt: newStart }
            }
        ]
    });

    if (doesOverlap) {
        throw new AppError(400, 'It overlaps with another class schedule')

    }


    // 3. create and insert data
    const newData = {
        ...data,
        date: new Date(date),
        startTime: newStart,
        endTime: newEnd,
        completed: null, // true / false / null
        createAt: new Date(),
        userEmail
    };
    // console.log(req.user)
    const result = await tasksCollection.insertOne(newData);
    return result;
};

const getAllTasksFromDB = async (query) => {
    const tasksCollection = await getCollection("tasks");

    const {
        view = 'flat',
        type = 'next',
        timezone = 'Asia/Dhaka',
        page = 1,
        limit = 5,
        email
    } = query;
    const now = new Date();
    let pageNum = parseInt(page);
    let pageLimit = parseInt(limit);
    pageNum = Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1;
    pageLimit = Number.isInteger(pageLimit) && pageLimit > 0 ? pageLimit : 1;
    const skip = (pageNum - 1) * pageLimit;
    const pipeline = [];
    const countPipeline = [];

    const matchStage = {
        userEmail: email
    };

    let order;
    const lowercaseType = type?.toLowerCase();
    switch (lowercaseType) {
        case "next":
            // if the endTime is greater than current time setting query type=next will return it
            matchStage.endTime = { $gte: now };
            order = 1;
            break;
        case "prev":
            matchStage.endTime = { $lt: now };
            order = -1;
            break;
        default:
            throw new AppError(400, 'Invalid type query parameter')
    }
    pipeline.push({ $match: matchStage });
    countPipeline.push({ $match: matchStage });

    const validTimezones = Intl.supportedValuesOf("timeZone");

    if (!validTimezones.includes(timezone)) {
        throw new AppError(400, 'Invalid timezone')
    }
    const dateGroup = {
        $group: {
            _id: {
                // STEP-3I --> formatting date property
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$startTime",
                    timezone: timezone
                }
            },
            // STEP-3II --> make array of classes for each date on startTime
            tasks: { $push: "$$ROOT" },
            // STEP-3III --> get the total sum of classes held for each date
            totalTasks: { $sum: 1 }
        }
    }

    const lowerCaseView = view.toLowerCase();
    switch (lowerCaseView) {

        case "flat":
            pipeline.push(
                {
                    $facet: {
                        data: [
                            { $sort: { startTime: order } },
                            { $skip: skip },
                            { $limit: pageLimit }
                        ],
                        count: [
                            { $count: "total" }
                        ]
                    }
                });
            break;
        case "group":
            pipeline.push(
                dateGroup,
                {
                    $facet: {
                        data: [
                            { $sort: { _id: order } },
                            { $skip: skip },
                            { $limit: pageLimit },
                            {
                                $project: {
                                    _id: 0,
                                    date: "$_id",
                                    tasks: 1,
                                    totalTasks: 1
                                }
                            }
                        ],
                        count: [
                            { $count: "total" }
                        ]
                    }
                }
            )
            break;
        default:
            throw new AppError(400, ' Invalid view query parameter');
    };


    const tasksData = await tasksCollection?.aggregate(pipeline).toArray();
    // console.log(tasksData)
    const tasks = tasksData[0]?.data;
    const totalTasks = tasksData[0]?.count[0]?.total;

    const totalPages = Math.ceil(totalTasks / pageLimit) || 1;
    const result = {
        view: lowerCaseView,
        type: lowercaseType,
        pageLimit,
        currentPage: pageNum,
        totalTasks,
        totalPages,
        tasks
    };
    return result
};

const updateTaskInDB = async (id, taskData, userEmail) => {
    const tasksCollection = await getCollection("tasks");

    // const { id } = req.params;
    const { startTime, endTime, date, ...task } = taskData;
    const query = {
        _id: new ObjectId(id),
        userEmail: userEmail
    };
    const updatedDoc = {
        $set: {
            ...task,
            date: new Date(date),
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            updateAt: new Date()
        }
    };
    const result = await tasksCollection.updateOne(query, updatedDoc);
    if (result.matchedCount === 0) {
        throw new AppError(404, 'Could not find task or not authorized')
    }
    return result
};

const deleteTaskFromDB = async (id, userEmail) => {
    // const { id } = req.params;
    // throw new AppError(404, ' we cant de')
    const tasksCollection = await getCollection("tasks");
    const query = { _id: new ObjectId(id), userEmail: userEmail };
    const result = await tasksCollection.deleteOne(query);
    if (result.deletedCount === 0) {
        throw new AppError(404, 'Task is not available or not authorized');
    }
    return result;
};

const getThisMonthTasks = async (query, userEmail) => {
    const tasksCollection = await getCollection("tasks");

    const { year, month } = query;
    const { startOfMonth, endOfMonth } = getStartAndEndMonth(year, month);

    const tasks = await tasksCollection.find({
        userEmail: userEmail,
        date: {
            $gte: startOfMonth,
            $lt: endOfMonth
        }
    }).toArray();


    const result = {
        year,
        month,
        data: tasks
    };
    return result
}

const deleteAllTasksFromDB = async () => {
    const tasksCollection = await getCollection("tasks");
    const result = await tasksCollection.deleteMany({});
    return result
};

export const tasksService = {
    deleteAllTasksFromDB,
    insertTaskIntoDB,
    getAllTasksFromDB,
    updateTaskInDB,
    deleteTaskFromDB,
    getThisMonthTasks
}