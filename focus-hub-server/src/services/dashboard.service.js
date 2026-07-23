import axios from "axios";

const getDashboardDataFromDB = async (query, headers, url) => {
    const { year = 2026, month = 7 } = query;
    const classesData = await axios.get(`${url}/api/classes/month?year=${year}&month=${month}`, {
        headers: headers,
        validateStatus: status => status === 200 || status === 404
    });
    const tasks = await axios.get(`${url}/api/tasks/month?year=${year}&month=${month}`, {
        headers: headers,
        validateStatus: status => status === 200 || status === 404
    });

    const result = {
        year,
        month,
        classes: classesData.data.data.data,
        tasks: tasks.data.data.data
    };
    return result
};

export const dashboardServices = {
    getDashboardDataFromDB
}