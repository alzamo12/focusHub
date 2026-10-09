import express from "express";
import cors from "cors";

import aiRoutes from "./routes/ai.routes.js";
import classRoutes from "./routes/class.routes.js";
import taskRoutes from "./routes/task.routes.js";
import userRoutes from "./routes/user.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import notesRoutes from "./routes/note.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { getCollection } from "./config/db.js";
import summarizerRoutes from "./routes/summarizer.route.js"
import questionRoutes from "./routes/question.routes.js"

const app = express();

app.use(express.json());

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://focus-hub-63922.web.app',
        'https://focus-hub-63922.firebaseapp.com',
        // 'https://focus-hub-client.vercel.app'
        'https://focus-hub-client.vercel.app'
    ],
    credentials: true,
}));

// routes
app.get("/", (req, res) => {
    res.send("Focus Hub API is running");
});

app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes)
app.use("/api/classes", classRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/create_payment_intent", paymentRoutes);
app.use("/api/summarization", summarizerRoutes);
app.use("/api/questions", questionRoutes)
app.use((err, req, res, next) => {
    if (err instanceof Error && err.name === "MulterError") {
        return res.status(400).json({
            message:
                err.code === "LIMIT_FILE_SIZE"
                    ? "Image must be smaller than 8 MB."
                    : "Invalid image upload.",
        });
    }

    if (err.message?.includes("Only JPG")) {
        return res.status(400).json({ message: err.message });
    }

    console.error(err);
    res.status(500).json({ message: "Internal server error." });
});

export default app;