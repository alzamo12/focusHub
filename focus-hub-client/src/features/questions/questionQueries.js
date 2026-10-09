import { useMemo } from "react";
import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { createQuestionApi } from "./questionApi";

export const questionKeys = {
    all: ["questions"],
    lists: () => ["questions", "list"],
    list: (filters) => ["questions", "list", filters],
    details: () => ["questions", "detail"],
    detail: (id) => ["questions", "detail", id],
};

export function useQuestionApi() {
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    return useMemo(
        () => createQuestionApi(axiosPublic, axiosSecure),
        [axiosPublic, axiosSecure]
    );
}

export function useQuestions(filters) {
    const api = useQuestionApi();

    return useQuery({
        queryKey: questionKeys.list(filters),
        queryFn: () => api.getQuestions(filters),
    });
}

export function useQuestion(id) {
    const api = useQuestionApi();

    return useQuery({
        queryKey: questionKeys.detail(id),
        queryFn: () => api.getQuestion(id),
        enabled: Boolean(id),
    });
}

export function useCreateQuestion() {
    const api = useQuestionApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData) => api.createQuestion(formData),

        onSuccess: (question) => {
            queryClient.invalidateQueries({
                queryKey: questionKeys.lists(),
            });

            queryClient.setQueryData(
                questionKeys.detail(question._id),
                question
            );
        },
    });
}

export function useAddAnswer(questionId) {
    const api = useQuestionApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (answer) => api.addAnswer(questionId, answer),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: questionKeys.detail(questionId),
            });

            queryClient.invalidateQueries({
                queryKey: questionKeys.lists(),
            });
        },
    });
}

export function useSetAcceptedAnswer(questionId) {
    const api = useQuestionApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (answerId) =>
            api.setAcceptedAnswer(questionId, answerId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: questionKeys.detail(questionId),
            });

            queryClient.invalidateQueries({
                queryKey: questionKeys.lists(),
            });
        },
    });
}