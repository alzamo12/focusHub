import { Router } from "express";
import { getDashboardData } from "../controllers/dashboard.controllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
const dashboardRoutes = Router();

dashboardRoutes.get("/", verifyToken, getDashboardData);

export default dashboardRoutes;