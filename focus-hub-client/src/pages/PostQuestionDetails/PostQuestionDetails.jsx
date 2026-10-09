import { useState } from "react";
import { Link, useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import {
    useQuestion,
    useAddAnswer,
    useSetAcceptedAnswer,
} from "../../features/questions/questionQueries";

export default function PostQuestionDetails() {
    const { id } = useParams();
    const { user } = useAuth();

    const { data: question, isPending, isError, error } = useQuestion(id);
    const addAnswer = useAddAnswer(id);
    const acceptAnswer = useSetAcceptedAnswer(id);

    const [body, setBody] = useState("");
    const [message, setMessage] = useState("");

    if (isPending) return <p>Loading question...</p>;

    if (isError || !question) {
        return (
            <p role="alert" className="text-red-600">
                {error?.response?.data?.message || "Question not found."}
            </p>
        );
    }

    const isOwner = Boolean(
        user && user.uid === question.author.uid
    );

    // Keep the accepted answer at the top.
    const answers = [...question.answers].sort((a, b) => {
        if (a._id === question.acceptedAnswerId) return -1;
        if (b._id === question.acceptedAnswerId) return 1;

        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    async function handleAnswer(e) {
        e.preventDefault();
        setMessage("");

        if (!user) {
            setMessage("Please log in to answer this question.");
            return;
        }

        if (!body.trim()) {
            setMessage("Write an answer first.");
            return;
        }

        try {
            await addAnswer.mutateAsync({
                body: body.trim(),
                authorName: user.displayName || "Student",
                authorPhotoURL: user.photoURL || "",
            });

            setBody("");
            setMessage("Your answer was posted.");
        } catch (err) {
            setMessage(
                err.response?.data?.message || "Failed to post answer."
            );
        }
    }

    async function handleAccept(answerId) {
        try {
            // Clicking the accepted answer again removes acceptance.
            const nextId =
                question.acceptedAnswerId === answerId ? null : answerId;

            await acceptAnswer.mutateAsync(nextId);
        } catch (err) {
            setMessage(
                err.response?.data?.message || "Failed to update answer."
            );
        }
    }

    return (
        <main className="mx-auto max-w-4xl space-y-6 ">
            <Link
                to="/dashboard/post-questions"
                className="text-sm font-medium text-sky-700 "
            >
                ← Back to questions
            </Link>

            <article className="rounded-2xl border mt-4 bg-base-100 text-base-content p-5 sm:p-7">
                <div className="mb-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-secondary">
                        {question.className}
                    </span>
                    <span className="rounded-full bg-slate-100 text-secondary px-3 py-1">
                        {question.subject}
                    </span>
                </div>

                <h1 className="text-2xl font-bold text-base-content">
                    {question.title}
                </h1>

                <p className="mt-2 text-sm text-slate-500 dark:text-primary">
                    Asked by {question.author?.name || "Student"} ·{" "}
                    {new Date(question.createdAt).toLocaleDateString()}
                </p>

                {question.body && (
                    <p className="mt-5 whitespace-pre-wrap leading-7 text-base-content">
                        {question.body}
                    </p>
                )}

                {question.image?.url && (
                    <a
                        href={question.image.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-block"
                    >
                        <img
                            src={question.image.url}
                            alt="Question attachment"
                            className="max-h-[500px] max-w-full rounded-xl object-contain"
                        />
                    </a>
                )}
            </article>

            <section className="space-y-4">
                <h2 className="text-xl font-bold text-base-content">
                    Answers ({question.answers.length})
                </h2>

                {answers.length === 0 && (
                    <div className="rounded-xl border border-dashed p-6 text-center">
                        <p className="font-medium">No answers yet</p>
                        <p className="mt-1 text-sm text-slate-500">
                            Be the first to help this student.
                        </p>
                    </div>
                )}

                {answers.map((answer) => {
                    const accepted =
                        answer._id === question.acceptedAnswerId;

                    return (
                        <article
                            key={answer._id}
                            className={`rounded-xl border bg-base-100 p-5 ${accepted
                                    ? "border-emerald-400"
                                    : "border-slate-200"
                                }`}
                        >
                            {accepted && (
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                                    ✓ Accepted answer
                                </div>
                            )}

                            <p className="whitespace-pre-wrap leading-7 text-base-content">
                                {answer.body}
                            </p>

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                                <div>
                                    <p className="text-sm font-medium text-base-content">
                                        {answer.author?.name || "Student"}
                                    </p>
                                    <p className="text-xs text-base-content">
                                        {new Date(answer.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                {isOwner && (
                                    <button
                                        type="button"
                                        disabled={acceptAnswer.isPending}
                                        onClick={() => handleAccept(answer._id)}
                                        className={`rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-50 ${accepted
                                                ? "border border-emerald-300 text-emerald-700"
                                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                                            }`}
                                    >
                                        {accepted ? "Unaccept answer" : "Accept answer"}
                                    </button>
                                )}
                            </div>
                        </article>
                    );
                })}
            </section>

            <form
                onSubmit={handleAnswer}
                className="space-y-4 rounded-2xl border bg-base-100 border-primary 
                shadow-primary shadow-md p-5"
            >
                <h2 className="text-lg font-bold text-base-content">Write an answer</h2>

                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    maxLength={5000}
                    rows={5}
                    placeholder="Explain the solution step by step..."
                    className="w-full rounded-lg border p-3 text-base-content"
                />

                {message && (
                    <p role="status" className="text-sm text-base-content">
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={addAnswer.isPending}
                    className="rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
                >
                    {addAnswer.isPending ? "Submitting..." : "Submit answer"}
                </button>
            </form>
        </main>
    );
}