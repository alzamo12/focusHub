import { useState } from "react";
import { Link } from "react-router";
import { useQuestions } from "./questionQueries";

const classes = [
    "Class 6", "Class 7", "Class 8", "Class 9",
    "Class 10", "Class 11", "Class 12",
];

const subjects = [
    "Bangla", "English", "Mathematics", "Higher Mathematics",
    "Physics", "Chemistry", "Biology", "ICT",
];

export default function QuestionFeed() {
    const [className, setClassName] = useState("");
    const [subject, setSubject] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const { data, isPending, isError, error, isFetching } = useQuestions({
        className,
        subject,
        search,
        page,
        limit: 10,
    });

    function updateFilter(setter, value) {
        setter(value);
        setPage(1);
    }

    if (isPending) {
        return <p className="py-8 text-slate-500">Loading questions...</p>;
    }

    if (isError) {
        return (
            <p role="alert" className="py-8 text-red-600">
                {error.response?.data?.message || "Failed to load questions."}
            </p>
        );
    }

    const questions = data.questions;
    const pagination = data.pagination;

    return (
        <section className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 dark:text-white">
                <select
                    value={className}
                    onChange={(e) => updateFilter(setClassName, e.target.value)}
                    className="rounded-lg border p-3"
                >
                    <option value="">All classes</option>
                    {classes.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>

                <select
                    value={subject}
                    onChange={(e) => updateFilter(setSubject, e.target.value)}
                    className="rounded-lg border p-3"
                >
                    <option value="">All subjects</option>
                    {subjects.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>

                <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            updateFilter(setSearch, searchInput.trim());
                        }
                    }}
                    placeholder="Search questions..."
                    className="rounded-lg border p-3"
                />

                <button
                    onClick={() => updateFilter(setSearch, searchInput.trim())}
                    className="rounded-lg bg-slate-900 px-4 py-3 font-medium text-white"
                >
                    Search
                </button>
            </div>

            {isFetching && (
                <p className="text-xs text-slate-500">Updating feed...</p>
            )}

            {questions.length === 0 ? (
                <div className="rounded-xl border border-dashed p-8 text-center">
                    <h3 className="font-semibold">No questions found</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Try different filters or ask the first question.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {questions.map((question) => (
                        <article
                            key={question._id}
                            className="rounded-xl border border-slate-200 bg-base-100 dark:text-white p-5 transition hover:border-sky-300"
                        >
                            <div className="mb-3 flex flex-wrap gap-2 text-xs">
                                <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">
                                    {question.className}
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                                    {question.subject}
                                </span>
                                {question.acceptedAnswerId && (
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                                        Answer accepted
                                    </span>
                                )}
                            </div>

                            <Link
                                to={`/post-questions/${question._id}`}
                                className="text-lg font-bold text-base-content hover:text-sky-700"
                            >
                                {question.title}
                            </Link>

                            {question.body && (
                                <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">
                                    {question.body}
                                </p>
                            )}

                            {question.image?.url && (
                                <img
                                    src={question.image.url}
                                    alt="Attached question"
                                    loading="lazy"
                                    className="mt-3 max-h-64 rounded-lg object-contain"
                                />
                            )}

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-sm text-slate-500 dark:text-slate-400">
                                <span>
                                    By {question.author?.name || "Student"}
                                </span>
                                <span>
                                    {question.answers?.length || 0} answers
                                </span>
                                <Link
                                    to={`/dashboard/post-questions/${question._id}`}
                                    className="font-semibold text-primary"
                                >
                                    View question →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between gap-3">
                <button
                    disabled={page <= 1 || isFetching}
                    onClick={() => setPage((current) => current - 1)}
                    className="rounded-lg border px-4 py-2 disabled:opacity-40"
                >
                    Previous
                </button>

                <span className="text-sm text-slate-500">
                    Page {pagination.page} of {Math.max(1, pagination.totalPages)}
                </span>

                <button
                    disabled={page >= pagination.totalPages || isFetching}
                    onClick={() => setPage((current) => current + 1)}
                    className="rounded-lg border px-4 py-2 disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </section>
    );
}