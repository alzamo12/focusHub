import { Navigate, useLocation } from "react-router";
import LoadingSpinner from "../components/Spinner/LoadingSpinner";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({children}) => {
    const {user, loading} = useAuth();
    const location = useLocation();
    const from = location?.pathname || "/";

    if(loading) return <LoadingSpinner/>;
    if(user) return children;

    return <Navigate to="/auth/signin" state={{location: from}}/>
};

export default PrivateRoute;