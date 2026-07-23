import React from 'react';
import GenerateForm from '../../components/Forms/GenerateForm';
import { useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import LoadingSpinner from '../../components/Spinner/LoadingSpinner';
import ReactMarkdown from "react-markdown";
import ReactQuill from 'react-quill-new';
import NoteViewer from '../../components/NoteViewer/NoteViewer';
import "react-quill-new/dist/quill.bubble.css";
import { useState } from 'react';
import DOMPurify from "dompurify";
import { useEffect } from 'react';
import { useRef } from 'react';
import { toast } from 'react-toastify';

const GenerateNote = ({ handleGeneratedSaveNote }) => {
    const axiosSecure = useAxiosSecure();
    const hasRestoredRef = useRef(false);
    const [note, setNote] = useState(null);
    const [retryAfter, setRetryAfter] = useState(0);
    // step-1: update retryAfter state on every second
    useEffect(() => {
        if (retryAfter <= 0) return;
        const interval = setInterval(() => {
            setRetryAfter((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                };
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval);
    }, [retryAfter]);

    useEffect(() => {
        // return on first render
        if (!hasRestoredRef.current) return;

        if (retryAfter > 0) {
            localStorage.setItem(
                "ai_retry_until",
                Date.now() + retryAfter * 1000
            );
        } else {
            localStorage.removeItem("ai_retry_until");
        }
    }, [retryAfter]);

    // step-3: on first mount get the retry after value from LS
    useEffect(() => {
        const retryUntil = localStorage.getItem("ai_retry_until");
        if (retryUntil) {
            const diff = Math.ceil((retryUntil - Date.now()) / 1000);
            if (diff > 0) setRetryAfter(diff);
        }
        hasRestoredRef.current = true;
    }, []);

    const { data: generatedNote, mutateAsync, isPending } = useMutation({
        mutationFn: async (data) => {
            const res = await axiosSecure.post("/ai/generate-notes", data);

            return res.data
        },
        onSuccess: (data) => {
            const clean = data.data
                .replace(/^```json\s*/i, "")
                .replace(/\s*```$/, "");

            const delta = JSON.parse(clean);
            setNote(delta);
            setRetryAfter(30)
        },
        onError: (err) => {
            console.log(err)
            const status = err?.response?.status;
            switch (status) {
                case 503:
                    toast.error(err.response?.data?.message);
                    break;
                case 429: {
                    // const retryAfter = err.response.data.retryAfter;
                    const { message, retryAfter } = err.response.data;
                    setRetryAfter(retryAfter);
                    // console.log(message)
                    toast.error(message)
                    break
                }
                default:
                    toast.error("Please try again later")
            }
        }
    });


    const handleSubmit = async (data) => {
        const { chapter, language, level, subTopic, subject, type } = data;
        const generateNotesData = {
            subject: subject.value,
            chapter: chapter.value,
            level: level.value,
            subTopic: subTopic.value,
            type: type.value,
            language: language.value
        };
        mutateAsync(generateNotesData)
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "color",
        "background",
        "list",
        "bullet",
        "link",
        "image",
        "table",
        "blockquote",
        "code-block",
        "script",   // for sub/sup
        "strike",
    ];

    return (
        <div>
            <h2 className="card-title relative mt-4 md:mt-0 text-2xl flex items-center justify-center font-bold">Generate questions</h2>
            <GenerateForm
                formType="notes"
                retryAfter={retryAfter}
                handleSubmit={handleSubmit} />
            <div className='my-10 relative w-full p-4 border border-primary 
            rounded-lg min-h-50 bg-white  shadow-lg'>
                {
                    isPending ?
                        <div className='absolute flex inset-0 justify-center items-center z-50  '>
                            <div className='loading loading-xl loading-ring text-black' />
                        </div>
                        :
                        <div>
                            <div className='flex justify-between'>
                                <h2 className="card-title font-bold mb-4 text-black ">Here is the answer:</h2>
                                <button
                                    onClick={() => handleGeneratedSaveNote(generatedNote?.data)}
                                    className='btn bg-primary text-black font-bold border-none'
                                >Save</button>
                            </div>
                            <article className="prose prose-lg max-w-none ">
                                <ReactQuill
                                    value={note}
                                    readOnly
                                    theme="bubble"
                                    formats={formats}
                                    className='dark:text-black'
                                />
                            </article>
                        </div>
                }
            </div>
        </div>
    );
};

export default GenerateNote;