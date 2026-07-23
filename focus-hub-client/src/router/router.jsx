import { createBrowserRouter } from "react-router";
import SignIn from "../pages/SignIn/SignIn"
import SignUp from "../pages/SignUp/SignUp"
import RootLayout from "../layout/RootLayout";
import AuthLayout from "../layout/AuthLayout";
import Home from "../pages/home/Home";
import ClassScheduleTracker from "../pages/classScheduleTracker/ClassScheduleTracker";
import GenerateQuestions from "../pages/GenerateQuestions/GenerateQuestions";
import Budget from "../pages/Budget/Budget";
import PrivateRoute from "./PrivateRoute";
import Notes from "../pages/Note/Notes";
import NoteDetails from "../pages/NoteDetails/NoteDetails";
import EditNote from "../pages/EditNote/EditNote";
import Tasks from "../pages/Tasks/Tasks";
import Settings from "../pages/Settings/Settings";
import LandingPage from "../pages/LandingPage/LandingPage";

const router = createBrowserRouter([
    {
        path: "/",
        Component: LandingPage
    },
    {
        path: "/dashboard",
        element: <PrivateRoute><RootLayout /></PrivateRoute>,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: 'class-schedule-tracker',
                Component: ClassScheduleTracker
            },
            {
                path: "generate-questions",
                Component: GenerateQuestions
            },
            {
                path: "budget",
                Component: Budget
            },
            {
                path: "tasks",
                Component: Tasks
            },
            {
                path: "notes",
                Component: Notes
            },
            {
                path: "note/:id",
                Component: NoteDetails
            },
            {
                path: "editNote/:id",
                Component: EditNote
            },
            {
                path: "settings",
                Component: Settings
            }
        ]
    },
    {
        path: '/auth',
        Component: AuthLayout,
        children: [
            {
                path: 'signin',
                Component: SignIn
            },
            {
                path: "signup",
                Component: SignUp
            }
        ]
    },
]);

export default router