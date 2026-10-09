import { useEffect, useRef, useState } from "react";
import {
    Upload,
    Image as ImageIcon,
    Sparkles,
    LoaderCircle,
    X,
    BookOpen,
    Layers,
    Tags,
    FileText,
    Trash2,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
} from "lucide-react";

import Swal from 'sweetalert2';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/Spinner/LoadingSpinner";


const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

const tabs = [
    { id: "flashcards", label: "Flashcards", icon: Layers },
    { id: "definitions", label: "Definitions", icon: BookOpen },
    { id: "keywords", label: "Keywords", icon: Tags },
    { id: "summary", label: "Summary", icon: FileText },
];

export default function AiSummarizer() {
    const inputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [material, setMaterial] = useState(null);
    // const [savedMaterials, setSavedMaterials] = useState([]);
    const [activeTab, setActiveTab] = useState("flashcards");
    const [currentCard, setCurrentCard] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [dragging, setDragging] = useState(false);



    /* ---------- Image preview URL (created + cleaned up) ---------- */
    useEffect(() => {
        if (!file) {
            setPreview("");
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const { data: savedMaterials, isLoading: getLoading } = useQuery({
        queryKey: ["summarization"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/summarization?email=${user?.email}`);
            return res.data
        }
    })

    const { mutateAsync: summarizerAsync, isPending: insertPending } = useMutation({
        mutationFn: async (data) => {
            const res = await axiosSecure.post(`/ai/summarize`, data);
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['summarization'] });

            toast.success("data inserted successfully")
        }
    });

    const { mutateAsync: deleteAsync, isPending: deletePending } = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/summarization/${id}`);
            console.log(res.data)
            return res.data
        },
        onSuccess: async () => {
            queryClient.invalidateQueries(['summarization']);

            toast.success("deleted successfully")
        }
    });

    /* ---------- Helpers ---------- */
    function resetStudyView() {
        setActiveTab("flashcards");
        setCurrentCard(0);
        setShowAnswer(false);
    }

    function selectFile(selectedFile) {
        setError("");

        if (!selectedFile) return;

        if (!ALLOWED_TYPES.includes(selectedFile.type)) {
            setError("Choose a JPG, PNG, or WebP image.");
            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            setError("Your image must be smaller than 8 MB.");
            return;
        }

        setFile(selectedFile);
        setMaterial(null);
        resetStudyView();
    }

    async function handleGenerate() {
        if (!file || loading) return;

        setLoading(true);
        setError("");

        try {
            // const generated = await generateStudyMaterial(file);
            const formData = new FormData();
            formData.append("page", file);
            const generated = await summarizerAsync(formData);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Could not generate study material. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    function openMaterial(item) {
        if (loading) return;

        setMaterial(item);
        setFile(null);
        setError("");
        resetStudyView();
    }

    async function handleDelete(id) {
        if (loading) return;

        // if (!window.confirm("Delete this study material permanently?")) {
        //     return;
        // }
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {

                try {
                    await deleteAsync(id);

                } catch (err) {
                    setError(
                        err.response?.data?.message || "Could not delete this material."
                    );
                }
            }
        });


    }

    function clearSelection() {
        setFile(null);
        setMaterial(null);
        setError("");
        resetStudyView();
    }

    /* ---------- Derived data ---------- */
    const flashcards = material?.flashcards || [];
    const definitions = material?.definitions || [];
    const keywords = material?.keywords || [];

    // Keep the index valid even if the card list changes.
    const cardIndex = Math.min(
        currentCard,
        Math.max(flashcards.length - 1, 0)
    );
    const card = flashcards[cardIndex];

    function moveCard(direction) {
        setCurrentCard(
            Math.max(0, Math.min(flashcards.length - 1, cardIndex + direction))
        );
        setShowAnswer(false);
    }

    function restartCards() {
        setCurrentCard(0);
        setShowAnswer(false);
    };

    if (getLoading || insertPending) {
        return <LoadingSpinner />
    }

    /* ---------- Render ---------- */
    return (
        <main className="min-h-screen  px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Page heading */}
                <header className="mb-8">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400">
                        <Sparkles size={17} />
                        FOCUSHUB AI TOOLS
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Turn pages into knowledge.
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                        Upload a textbook page and let AI create flashcards, definitions,
                        keywords, and a concise summary for you.
                    </p>
                </header>

                <div className="grid items-start gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
                    {/* Upload panel */}
                    <aside className="space-y-5">
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:bg-transparent dark:border-primary shadow-md shadow-primary">
                            <h2 className="mb-4 font-semibold">Upload a textbook page</h2>

                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(event) => {
                                    selectFile(event.target.files?.[0]);
                                    event.target.value = "";
                                }}
                            />

                            {!preview ? (
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => inputRef.current?.click()}
                                    onDragOver={(event) => {
                                        event.preventDefault();
                                        setDragging(true);
                                    }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={(event) => {
                                        event.preventDefault();
                                        setDragging(false);
                                        selectFile(event.dataTransfer.files?.[0]);
                                    }}
                                    className={`flex min-h-52 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition ${dragging
                                        ? "border-sky-500 bg-sky-50 dark:bg-sky-950"
                                        : "border-slate-300 hover:border-sky-400 dark:border-slate-700"
                                        }`}
                                >
                                    <div className="mb-4 rounded-xl bg-sky-100 p-3 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                                        <Upload size={25} />
                                    </div>

                                    <span className="font-semibold">Click or drop an image</span>

                                    <span className="mt-2 text-xs text-slate-500">
                                        JPG, PNG, or WebP · Max 8 MB
                                    </span>
                                </button>
                            ) : (
                                <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                                    <img
                                        src={preview}
                                        alt="Selected textbook page"
                                        className="max-h-80 w-full bg-slate-100 object-contain dark:bg-slate-800"
                                    />

                                    <button
                                        type="button"
                                        aria-label="Remove selected image"
                                        disabled={loading}
                                        onClick={clearSelection}
                                        className="absolute right-2 top-2 rounded-lg bg-white p-2 text-slate-700 shadow hover:bg-slate-100 disabled:opacity-50"
                                    >
                                        <X size={17} />
                                    </button>
                                </div>
                            )}

                            {file && (
                                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <ImageIcon size={16} />
                                    <span className="min-w-0 flex-1 truncate">{file.name}</span>
                                    <span className="shrink-0 text-xs">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </div>
                            )}

                            <button
                                type="button"
                                disabled={!file || loading}
                                onClick={handleGenerate}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <LoaderCircle className="animate-spin" size={19} />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Generate study material
                                    </>
                                )}
                            </button>

                            <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                                AI-generated content can contain mistakes. Review important
                                facts and formulas.
                            </p>
                        </section>

                        {/* Previously generated materials */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:bg-transparent dark:border-primary shadow-md shadow-primary">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-semibold">Your library</h2>
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    {savedMaterials.length}
                                </span>
                            </div>

                            {savedMaterials.length === 0 ? (
                                <p className="text-sm leading-6 text-slate-500">
                                    Your generated study materials will appear here.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {savedMaterials.map((item) => (
                                        <div
                                            key={item._id}
                                            className={`flex items-center gap-2 rounded-xl border p-3 ${material?._id === item._id
                                                ? "border-sky-400 bg-sky-50 dark:bg-sky-950/50"
                                                : "border-slate-200 dark:border-slate-800"
                                                }`}
                                        >
                                            <button
                                                type="button"
                                                disabled={loading}
                                                onClick={() => openMaterial(item)}
                                                className="min-w-0 flex-1 text-left disabled:opacity-60"
                                            >
                                                <p className="truncate text-sm font-medium">
                                                    {item.title}
                                                </p>
                                                <p className="mt-1 truncate text-xs text-slate-500">
                                                    {item.subject}
                                                </p>
                                            </button>

                                            <button
                                                type="button"
                                                disabled={loading}
                                                aria-label={`Delete ${item.title}`}
                                                onClick={() => handleDelete(item._id)}
                                                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-950"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </aside>

                    {/* Generated material panel */}
                    <section className="min-w-0">
                        {error && (
                            <div
                                role="alert"
                                className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                            >
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center dark:bg-transparent dark:border-primary shadow-md shadow-primary">
                                <LoaderCircle size={40} className="animate-spin text-sky-500" />
                                <h2 className="mt-5 text-xl font-semibold">
                                    Creating your study material
                                </h2>
                                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                    Gemini is analyzing your page and organizing the important
                                    concepts. This may take a little while.
                                </p>
                            </div>
                        ) : !material ? (
                            <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center dark:bg-transparent dark:border-primary shadow-md shadow-primary">
                                <div className="rounded-2xl bg-sky-100 p-4 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                                    <BookOpen size={32} />
                                </div>
                                <h2 className="mt-5 text-xl font-semibold">Your study space</h2>
                                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                    Select a page and generate your first set of flashcards,
                                    definitions, and keywords.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {/* Material heading */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:bg-transparent dark:border-primary shadow-md shadow-primary sm:p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                                {material.subject}
                                            </span>
                                            <h2 className="mt-3 text-2xl font-bold">
                                                {material.title}
                                            </h2>
                                            <p className="mt-2 text-sm text-slate-500">
                                                {flashcards.length} flashcards · {definitions.length}{" "}
                                                definitions · {keywords.length} keywords
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={clearSelection}
                                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                        >
                                            New page
                                        </button>
                                    </div>

                                    {material.warnings?.length > 0 && (
                                        <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                                            {material.warnings.map((warning, index) => (
                                                <p key={index}>{warning}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Navigation tabs */}
                                <div className="flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 dark:bg-transparent dark:border-primary shadow-md shadow-primary">
                                    {tabs.map(({ id, label, icon: Icon }) => (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => setActiveTab(id)}
                                            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${activeTab === id
                                                ? "bg-sky-600 text-white"
                                                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                                }`}
                                        >
                                            <Icon size={16} />
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {/* Flashcards */}
                                {activeTab === "flashcards" && (
                                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:bg-transparent dark:border-primary shadow-md shadow-primary sm:p-8">
                                        {!card ? (
                                            <p className="py-12 text-center text-slate-500">
                                                No flashcards were generated for this page.
                                            </p>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between text-sm text-slate-500">
                                                    <span>Active recall</span>
                                                    <span>
                                                        {cardIndex + 1} / {flashcards.length}
                                                    </span>
                                                </div>

                                                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                    <div
                                                        className="h-full rounded-full bg-sky-500 transition-all"
                                                        style={{
                                                            width: `${((cardIndex + 1) / flashcards.length) * 100
                                                                }%`,
                                                        }}
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => setShowAnswer((value) => !value)}
                                                    className="mt-6 flex min-h-72 w-full flex-col items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 p-6 text-center transition hover:border-sky-300 dark:border-sky-900 dark:bg-sky-950/40"
                                                >
                                                    <span className="text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                                                        {showAnswer ? "Answer" : "Question"}
                                                    </span>

                                                    <p className="mt-5 text-lg font-semibold leading-8 sm:text-xl">
                                                        {showAnswer ? card.answer : card.question}
                                                    </p>

                                                    <span className="mt-6 text-xs text-slate-500">
                                                        Click to{" "}
                                                        {showAnswer ? "see question" : "reveal answer"}
                                                    </span>
                                                </button>

                                                <div className="mt-5 flex items-center justify-between gap-3">
                                                    <button
                                                        type="button"
                                                        disabled={cardIndex === 0}
                                                        onClick={() => moveCard(-1)}
                                                        className="flex items-center gap-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm disabled:opacity-40 dark:border-slate-700"
                                                    >
                                                        <ChevronLeft size={17} />
                                                        Previous
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={restartCards}
                                                        className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                        aria-label="Restart flashcards"
                                                    >
                                                        <RotateCcw size={17} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={cardIndex === flashcards.length - 1}
                                                        onClick={() => moveCard(1)}
                                                        className="flex items-center gap-1 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
                                                    >
                                                        Next
                                                        <ChevronRight size={17} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Definitions */}
                                {activeTab === "definitions" && (
                                    <div className="space-y-3">
                                        {definitions.length === 0 ? (
                                            <EmptyState text="No definitions were generated." />
                                        ) : (
                                            definitions.map((item, index) => (
                                                <article
                                                    key={`${item.term}-${index}`}
                                                    className="rounded-xl border border-slate-200 bg-white p-5 dark:bg-transparent dark:border-primary shadow-md shadow-primary"
                                                >
                                                    <h3 className="font-semibold text-sky-700 dark:text-sky-400">
                                                        {item.term}
                                                    </h3>
                                                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                                        {item.meaning}
                                                    </p>
                                                </article>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* Keywords */}
                                {activeTab === "keywords" && (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {keywords.length === 0 ? (
                                            <EmptyState text="No keywords were generated." />
                                        ) : (
                                            keywords.map((item, index) => (
                                                <article
                                                    key={`${item.word}-${index}`}
                                                    className="rounded-xl border border-slate-200 bg-white p-5 dark:bg-transparent dark:border-primary shadow-md shadow-primary"
                                                >
                                                    <h3 className="font-semibold">{item.word}</h3>
                                                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                                        {item.explanation}
                                                    </p>
                                                </article>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* Summary */}
                                {activeTab === "summary" && (
                                    <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:bg-transparent dark:border-primary shadow-md shadow-primary">
                                        <div className="mb-4 flex items-center gap-2">
                                            <FileText className="text-sky-500" size={20} />
                                            <h3 className="text-lg font-semibold">Page summary</h3>
                                        </div>
                                        <p className="whitespace-pre-wrap text-sm leading-8 text-slate-700 dark:text-slate-300">
                                            {material.summary}
                                        </p>
                                    </article>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}

function EmptyState({ text }) {
    return (
        <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
            {text}
        </div>
    );
}
