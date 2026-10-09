const BASE_URL = "/questions";

export function createQuestionApi(axiosPublic, axiosSecure) {
    return {
        async getQuestions(params) {
            const { data } = await axiosPublic.get(BASE_URL, { params });
            return data;
        },

        async getQuestion(id) {
            const { data } = await axiosPublic.get(`${BASE_URL}/${id}`);
            return data.question;
        },

        async createQuestion(payload) {
            const { data } = await axiosSecure.post(
                "/questions",
                payload
            );

            return data.question;
        },

        async addAnswer(id, answer) {
            const { data } = await axiosSecure.post(
                `${BASE_URL}/${id}/answers`,
                answer
            );
            return data.answer;
        },

        async setAcceptedAnswer(id, answerId) {
            const { data } = await axiosSecure.patch(
                `${BASE_URL}/${id}/accepted-answer`,
                { answerId }
            );
            return data;
        },
    };
}