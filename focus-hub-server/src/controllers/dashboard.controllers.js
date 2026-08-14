import axios from "axios";
import { dashboardServices } from "../services/dashboard.service.js";
import sendResponse from "../utils/sendResponse.js";
import sendError from "../utils/sendError.js"
export const getDashboardData = async (req, res) => {
    try {
        // const url ="http://localhost:5000";
        const url = "https://focus-hub-server.vercel.app";
        const headers = {
            'Authorization': `${req.headers.authorization}`,
            'Accept': 'application/json'
        };

        const result = await dashboardServices.getDashboardDataFromDB(req.query, headers, url)
        // console.log(classesData)
        // res.status(200).send(result)
        sendResponse(res, 200, 'Dashboard data got successfully', result)
    } catch (err) {
        console.error(err)
        sendError(res, err.statusCode, err.message, err)
    }
};
