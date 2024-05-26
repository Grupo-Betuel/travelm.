import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "../context/authContext";

interface ProtectedRouteProps {
    roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
    const { user, token } = useAuth();
    console.log('user =>', user);

    if (!token) {
        return <Navigate to="/auth/sign-in" replace />;
    }

    if (user && roles && !roles.includes(user?.role)) {
        return <Navigate to="/dashboard/home" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
