import { ObjectId } from "mongodb";
import { getCollection, getDB } from "../config/db.js";

const COLLECTION = "questions";

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function createQuestion(data) {
    // const db = getDB();
    const questionCollection = await getCollection(COLLECTION);

    const question = {
        author: data.author,
        className: data.className,
        subject: data.subject,
        title: data.title,
        body: data.body || "",
        image: data.image || null,
        answers: [],
        acceptedAnswerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await questionCollection.insertOne(question);

    return {
        ...question,
        _id: result.insertedId,
    };
}

export async function getQuestions({
    className,
    subject,
    search,
    page = 1,
    limit = 10,
}) {
    // const db = getDB();
    const questionCollection = await getCollection(COLLECTION);


    const filter = {};

    if (className) filter.className = className;
    if (subject) filter.subject = subject;

    if (search) {
        const safeSearch = escapeRegex(search);

        filter.$or = [
            { title: { $regex: safeSearch, $options: "i" } },
            { body: { $regex: safeSearch, $options: "i" } },
        ];
    }

    // const collection = db.collection(COLLECTION);
    const skip = (page - 1) * limit;

    const [questions, total] = await Promise.all([
        questionCollection
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .project({
                title: 1,
                body: 1,
                className: 1,
                subject: 1,
                author: 1,
                image: 1,
                answers: 1,
                acceptedAnswerId: 1,
                createdAt: 1,
            })
            .toArray(),

        questionCollection.countDocuments(filter),
    ]);

    return {
        questions,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getQuestionById(id) {
    const questionCollection = await getCollection(COLLECTION);

    if (!ObjectId.isValid(id)) return null;

    return questionCollection
        .findOne({ _id: new ObjectId(id) });
}

export async function addAnswer(questionId, answer) {
    const questionCollection = await getCollection(COLLECTION);

    if (!ObjectId.isValid(questionId)) {
        return { error: "INVALID_ID" };
    }

    const answerDocument = {
        _id: new ObjectId(),
        author: answer.author,
        body: answer.body,
        createdAt: new Date(),
    };

    const result = await questionCollection.updateOne(
        { _id: new ObjectId(questionId) },
        {
            $push: { answers: answerDocument },
            $set: { updatedAt: new Date() },
        }
    );

    if (!result.matchedCount) return null;

    return answerDocument;
}

export async function acceptAnswer(questionId, answerId, email) {
    const questionCollection = await getCollection(COLLECTION);

    if (!ObjectId.isValid(questionId)) {
        return { error: "INVALID_ID" };
    }

    if (answerId !== null && !ObjectId.isValid(answerId)) {
        return { error: "INVALID_ANSWER_ID" };
    }

    // const collection = getDB().collection(COLLECTION);
    const _id = new ObjectId(questionId);

    const question = await questionCollection.findOne(
        { _id },
        { projection: { author: 1, answers: 1 } }
    );

    if (!question) return null;

    if (question.author.email !== email) {
        return { error: "FORBIDDEN" };
    }

    let acceptedAnswerId = null;

    if (answerId !== null) {
        const answer = question.answers.find(
            (item) => item._id.toString() === answerId
        );

        if (!answer) return { error: "ANSWER_NOT_FOUND" };

        acceptedAnswerId = answer._id;
    }

    await questionCollection.updateOne(
        { _id },
        {
            $set: {
                acceptedAnswerId,
                updatedAt: new Date(),
            },
        }
    );

    return { acceptedAnswerId };
}