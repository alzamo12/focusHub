import { useState } from "react";
import { useCreateQuestion } from "./questionQueries";
import useAuth from "../../hooks/useAuth";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary";

const classes = [
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
];

const subjects = [
    "Bangla",
    "English",
    "Mathematics",
    "Higher Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "ICT",
];

export default function QuestionForm() {
    const { user } = useAuth();
    const createQuestion = useCreateQuestion();

    const [className, setClassName] = useState("");
    const [subject, setSubject] = useState("");
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!user) {
            setError("Please log in before posting a question.");
            return;
        }

        if (!className || !subject || !title.trim()) {
            setError("Class, subject and title are required.");
            return;
        }

        if (!body.trim() && !image) {
            setError("Add question details or attach an image.");
            return;
        }

        try {
            // 1. Upload the image directly from the browser.
            const uploadedImage = image
                ? await uploadImageToCloudinary(image)
                : null;

            // 2. Send only the question data and image metadata to Express.
            const payload = {
                className,
                subject,
                title: title.trim(),
                body: body.trim(),
                image: uploadedImage,
                authorName: user.displayName || "Student",
                authorPhotoURL: user.photoURL || "",
            };

            await createQuestion.mutateAsync(payload);

            setClassName("");
            setSubject("");
            setTitle("");
            setBody("");
            setImage(null);

            e.target.reset();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Could not post your question."
            );
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-slate-200 bg-base-100 dark:text-white p-5 shadow-sm"
        >
            <h2 className="text-xl font-bold ">
                Ask a question
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
                <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                    className="w-full rounded-lg border p-3"
                >
                    <option value="">Select your class</option>
                    {classes.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

                <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full rounded-lg border p-3"
                >
                    <option value="">Select subject</option>
                    {subjects.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
                placeholder="What is your question?"
                className="w-full rounded-lg border p-3"
            />

            <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={10000}
                rows={5}
                placeholder="Explain what you have tried or where you are stuck..."
                className="w-full resize-y rounded-lg border p-3"
            />

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Attach an image (optional)
                </label>

                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="block w-full text-sm"
                />

                {image && (
                    <p className="mt-2 text-sm text-slate-500">
                        Selected: {image.name}
                    </p>
                )}
            </div>

            {error && (
                <p role="alert" className="text-sm text-red-600">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={createQuestion.isPending}
                className="rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {createQuestion.isPending ? "Posting..." : "Post question"}
            </button>
        </form>
    );
}