import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import LoadingSpinner from "../../components/Spinner/LoadingSpinner"
import GenerateForm from '../../components/Forms/GenerateForm';
import { toast } from "react-toastify"
import { useEffect } from 'react';
import { useRef } from 'react';
import useTittle from '../../hooks/useTittle';
const GenerateQuestions = () => {
    const axiosSecure = useAxiosSecure();
    const [retryAfter, setRetryAfter] = useState(0);
    const hasRestoredRef = useRef(false);
    useTittle("Generate Questions")
    // console.log(retryAfter)
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

    // step-2: save retry after in localstorage
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

    const { data: questionsData, mutateAsync, isPending } = useMutation({
        mutationFn: async (data) => {
            const res = await axiosSecure.post(`/ai/generate-questions`, data);
            return res.data
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Data got successfully");
                setRetryAfter(30)
            }
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

    const handleSubmit = ({ subject, chapter, level, subTopic, type, language }) => {
        // setLoading(true)
        const questionInfo = {
            subject: subject.value,
            chapter: chapter.label,
            level: level.value,
            subTopic: subTopic.label,
            type: type.value,
            language: language.value
        };
        // setQuestionInfo(questionInfo);
        // console.log(questionInfo)
        mutateAsync(questionInfo)
    };
    // console.log(questionInfo)

    return (
        <div className='overflow-hidden min-h-[100dvh] lg:min-h-full'>

            <h2 className="card-title dark:text-white relative mt-4 md:mt-0 text-2xl flex items-center justify-center font-bold">Generate questions</h2>
            <GenerateForm
                formType="questions"
                isPending={isPending}
                retryAfter={retryAfter}
                handleSubmit={handleSubmit} />
            <div className='my-10 relative w-full p-4 border border-primary rounded-lg min-h-[200px] bg-white dark:bg-black dark:text-white shadow-lg'>
                {
                    isPending ?
                        <div className='absolute flex inset-0 justify-center items-center z-50  '>
                            <div className='loading loading-xl loading-ring' />
                        </div>
                        :
                        <div>
                            <h2 className="card-title font-bold mb-4 ">Here is the answer:</h2>
                            <p className='whitespace-pre-line '>{questionsData?.data}</p>
                        </div>
                }
            </div>
        </div>
    );
};

export default GenerateQuestions;