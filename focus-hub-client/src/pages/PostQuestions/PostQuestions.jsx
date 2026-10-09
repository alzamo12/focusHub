import QuestionForm from "../../features/questions/QuestionForm";
import QuestionFeed from "../../features/questions/QuestionFeed";

export default function PostQuestions() {
    return (
        <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
            <header>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                    FocusHub Community
                </p>

                <h1 className="mt-2 text-3xl font-bold text-base-content">
                    Questions & Answers
                </h1>

                <p className="mt-2 text-slate-600 dark:text-slate-500">
                    Ask questions, share knowledge, and help other students learn.
                </p>
            </header>

            <QuestionForm />

            <section className="space-y-4">
                <h2 className="text-xl font-bold text-base-content">
                    Recent questions
                </h2>

                <QuestionFeed />
            </section>
        </main>
    );
}