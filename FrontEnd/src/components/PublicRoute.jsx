import { Navigate } from "react-router-dom";

const PublicRoute = ({ element: Component }) => {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken ? <Navigate to="/dashboard" /> : Component;
};

export default PublicRoute;
