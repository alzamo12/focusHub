// import { ObjectId } from "mongodb";
import cloudinary from "../config/cloudinary.js";
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  addAnswer,
  acceptAnswer,
} from "../services/question.service.js";

const allowedClasses = new Set([
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
]);

const allowedSubjects = new Set([
  "Bangla",
  "English",
  "Mathematics",
  "Higher Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "ICT",
]);

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function errorResponse(res, error) {
  const errors = {
    INVALID_ID: [400, "Invalid question ID"],
    INVALID_ANSWER_ID: [400, "Invalid answer ID"],
    FORBIDDEN: [403, "Only the question author can accept an answer"],
    ANSWER_NOT_FOUND: [404, "Answer not found"],
  };

  const [status, message] = errors[error] || [
    500,
    "Something went wrong",
  ];

  return res.status(status).json({ message });
}

export async function createQuestionController(req, res) {
  // let uploadedImage;
  console.log('create question server hit')
  try {
    const className = cleanText(req.body.className);
    const subject = cleanText(req.body.subject);
    const title = cleanText(req.body.title);
    const body = cleanText(req.body.body);
    const image = req.body.image ?? null;


    if (!allowedClasses.has(className)) {
      return res.status(400).json({ message: "Select a valid class" });
    }

    if (!allowedSubjects.has(subject)) {
      return res.status(400).json({ message: "Select a valid subject" });
    }

    if (!title || title.length > 200) {
      return res.status(400).json({
        message: "Title is required and must be under 200 characters",
      });
    }

    if (body.length > 10000) {
      return res.status(400).json({ message: "Question body is too long" });
    }

    if (!body && !req.file) {
      return res.status(400).json({
        message: "Provide question details or an image",
      });
    }

    // if (req.file) {
    //   const uploaded = await new Promise((resolve, reject) => {
    //     const stream = cloudinary.uploader.upload_stream(
    //       {
    //         folder: "focusHub",
    //         resource_type: "upload",
    //       },
    //       (error, result) => {
    //         if (error) reject(error);
    //         else resolve(result);
    //       }
    //     );

    //     stream.end(req.file.buffer);
    //   });

    //   uploadedImage = {
    //     url: uploaded.secure_url,
    //     publicId: uploaded.public_id,
    //   };
    // }
    if (image !== null) {
      if (
        typeof image !== "object" ||
        typeof image.url !== "string" ||
        typeof image.publicId !== "string"
      ) {
        return res.status(400).json({
          message: "Invalid image data",
        });
      }

      try {
        const url = new URL(image.url);

        if (
          url.protocol !== "https:" ||
          url.hostname !== "res.cloudinary.com" ||
          !url.pathname.startsWith(
            `/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`
          )
        ) {
          return res.status(400).json({
            message: "Invalid Cloudinary image URL",
          });
        }
      } catch {
        return res.status(400).json({
          message: "Invalid image URL",
        });
      }
    }

    const question = await createQuestion({
      author: {
        email: req.user.email,
        name: cleanText(req.body.authorName) || "Student",
        photoURL: cleanText(req.body.authorPhotoURL),
      },
      className,
      subject,
      title,
      body,
      image: image || null,
    });

    return res.status(201).send({
      message: "Question posted successfully",
      question,
    });
  } catch (error) {
    console.error("Create question error:", error);

    // if (uploadedImage?.publicId) {
    //   await cloudinary.uploader.destroy(uploadedImage.publicId).catch(() => { });
    // }

    return res.status(500).json({ message: "Failed to create question" });
  }
}

export async function getQuestionsController(req, res) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      30,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );

    const result = await getQuestions({
      className: cleanText(req.query.className),
      subject: cleanText(req.query.subject),
      search: cleanText(req.query.search).slice(0, 100),
      page,
      limit,
    });

    res.json(result);
  } catch (error) {
    console.error("Get questions error:", error);
    res.status(500).json({ message: "Failed to load questions" });
  }
}

export async function getQuestionController(req, res) {
  try {
    const question = await getQuestionById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ question });
  } catch (error) {
    console.error("Get question error:", error);
    res.status(500).json({ message: "Failed to load question" });
  }
}

export async function addAnswerController(req, res) {
  try {
    const body = cleanText(req.body.body);

    if (!body || body.length > 5000) {
      return res.status(400).json({
        message: "Answer is required and must be under 5000 characters",
      });
    }

    const answer = await addAnswer(req.params.id, {
      author: {
        email: req.user.email,
        name: cleanText(req.body.authorName) || "Student",
        photoURL: cleanText(req.body.authorPhotoURL),
      },
      body,
    });

    if (!answer) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (answer.error) return errorResponse(res, answer.error);

    res.status(201).json({
      message: "Answer posted successfully",
      answer,
    });
  } catch (error) {
    console.error("Add answer error:", error);
    res.status(500).json({ message: "Failed to post answer" });
  }
}

export async function acceptAnswerController(req, res) {
  try {
    const answerId = req.body.answerId;

    if (answerId !== null && typeof answerId !== "string") {
      return res.status(400).json({
        message: "answerId must be a string or null",
      });
    }

    const result = await acceptAnswer(
      req.params.id,
      answerId,
      req.user.email
    );

    if (!result) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (result.error) return errorResponse(res, result.error);

    res.json({
      message: answerId
        ? "Answer accepted successfully"
        : "Accepted answer removed",
      acceptedAnswerId: result.acceptedAnswerId,
    });
  } catch (error) {
    console.error("Accept answer error:", error);
    res.status(500).json({ message: "Failed to update accepted answer" });
  }
}