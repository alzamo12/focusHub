import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";
import { AppError } from "../utils/customError.js";
import { getStartAndEndMonth } from "../utils/getStartAndEndMonth.js";

const getClassesFromDB = async (query) => {
    const classesCollection = await getCollection("classes");

    const {
        view = 'flat',
        type = 'next',
        timezone = 'Asia/Dhaka',
        email,
        page = 1,
        limit = 5
    } = query;
    // console.log(limit)
    const now = new Date();
    let pageNum = parseInt(page);
    let pageLimit = parseInt(limit);
    pageNum = Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1;
    pageLimit = Number.isInteger(pageLimit) && pageLimit > 0 ? pageLimit : 5;
    const skip = (pageNum - 1) * pageLimit;
    const pipeline = [];

    // STEP-1 -->   match the user with userEmail and compare it with now date to endTime property

    const matchStage = {
        userEmail: email
    };

    // validate type query
    let order;
    const lowercaseType = type.toLowerCase();
    switch (lowercaseType) {
        case "next":
            // if the endTime is greater than current time setting query type=next will return it
            matchStage.endTime = { $gte: now };
            order = 1;
            break;
        case "prev":
            matchStage.endTime = { $lt: now };
            order = -1
            break;
        default:
            // return res.status(400).send({ message: "Invalid type query parameter" })
            throw new AppError(400, 'Invalid type query parameter')
    }
    pipeline.push({ $match: matchStage })
    // STEP-2 --> group every classes based on date using startTime property. date is defined as unique id
    // Get all supported IANA timezones
    const validTimezones = Intl.supportedValuesOf("timeZone");


    if (!validTimezones.includes(timezone)) {
        // console.log(timezone)
        // return res.status(400).send({ message: "Invalid timezone" });
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
            classes: { $push: "$$ROOT" },
            // STEP-3III --> get the total sum of classes held for each date
            totalClasses: { $sum: 1 }
        }
    };

    // STEP-4 -->  submit the result and as it is array convert it to array form json and use await

    // validate view
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
                                    classes: 1,
                                    totalClasses: 1
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
            // return res.status(400).send({ message: "Invalid view query parameter" })
            throw new AppError(400, 'Invalid view query parameter')
    };


    const classesData = await classesCollection.aggregate(pipeline).toArray();
    const classes = classesData[0]?.data;
    const totalClasses = classesData[0]?.count[0]?.total;
    const totalPages = Math.ceil(totalClasses / pageLimit) || 1;
    const resultedData = {
        view: lowerCaseView,
        type: lowercaseType,
        pageLimit,
        currentPage: pageNum,
        totalDoc: totalClasses,
        totalPages,
        classes: classes,
    };
    return resultedData
};

const createClassIntoDB = async (classData, userEmail) => {
    const classesCollection = await getCollection("classes");

    const { endTime, startTime, date, ...data } = classData;
    // const userEmail = ;

    // convert the start and end time into date ist object
    const newStart = new Date(startTime);
    const newEnd = new Date(endTime);

    // 1. start time is after endtime or invalid time return 
    if (newStart >= newEnd) {
        // return res.status(400).send({ message: "End time can not be before start time" })
        throw new AppError(400, 'End time can not be before start time')
    }

    // 2. check if the class schedule overlaps
    const doesOverlap = await classesCollection.findOne({
        userEmail,
        $or: [
            {
                startTime: { $lt: newEnd },
                endTime: { $gt: newStart }
            }
        ]
    });

    if (doesOverlap) {
        // return res.status(400).send({ message: "It overlaps with another class schedule" })
        throw new AppError(400, 'It overlaps with another class schedule')
    }


    // 3. create and insert data
    const newData = {
        ...data,
        date: new Date(date),
        startTime: newStart,
        endTime: newEnd,
        attended: null, // null || true || false
        createAt: new Date(),
        userEmail
    };
    const result = await classesCollection.insertOne(newData);
    return result
};

const updateClassInDB = async (id, classData, userEmail) => {
    const classesCollection = await getCollection("classes");

    const { startTime, endTime, date, ...clsData } = classData;
    // console.log('this is patch cls data', classData)
    const query = { _id: new ObjectId(id), userEmail: userEmail };
    // console.log('this patch cls query', query)
    // console.log(classData)
    const updatedDoc = {
        $set: {
            ...clsData,
            date: new Date(date),
            startTime: new Date(startTime),
            endTime: new Date(endTime)
        }
    };
    // console.log('this is patch cls updatedoc', updatedDoc)

    const result = await classesCollection.updateOne(query, updatedDoc);
    // console.log('class patch result', result)
    if (result.matchedCount === 0) {
        throw new AppError(403, "Not authorized or class not found")
    }
    return result
};

const deleteClassFromDB = async (id, userEmail) => {
    const classesCollection = await getCollection("classes");

    // const id = req.params.id;
    const query = { _id: new ObjectId(id), userEmail: userEmail };
    const result = await classesCollection.deleteOne(query);
    if (result.deletedCount === 0) {
        throw new AppError(404, 'not authorized or task could not find');
    }
    return result;
};

const getThisMonthClassesFromDB = async (query, userEmail) => {
    const classesCollection = await getCollection("classes");

    const { year, month } = query;
    const { startOfMonth, endOfMonth } = getStartAndEndMonth(year, month);
    // console.log('dashboard classes services', startOfMonth, endOfMonth)
    const classes = await classesCollection.find({
        userEmail: userEmail,
        date: {
            $gte: startOfMonth,
            $lte: endOfMonth
        }
    })
        .toArray();

    const result = {
        year,
        month,
        data: classes
    };
    return result
}

const deleteAllClassesFromDB = async () => {
    const classesCollection = await getCollection("classes");
    const result = await classesCollection.deleteMany({});
    return result
}

export const classesServices = {
    deleteAllClassesFromDB,
    getClassesFromDB,
    createClassIntoDB,
    updateClassInDB,
    deleteClassFromDB,
    getThisMonthClassesFromDB
}