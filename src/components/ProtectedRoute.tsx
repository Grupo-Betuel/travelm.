import React from 'react';
import {Navigate} from 'react-router-dom';
import {UserRoleTypes, UserTypes} from "../models/interfaces/userModel";
import {useCheckUserAuthorization} from "../hooks/useCheckUserAuthorization";

interface ProtectedRouteProps {
    roles?: UserRoleTypes[];
    userTypes?: UserTypes[];
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({roles, children, userTypes}) => {
    const {hasType, hasRole, token, user} = useCheckUserAuthorization({roles, userTypes});

    if (!token) {
        return <Navigate to="/auth/sign-in" replace/>;
    }

    if (token && (!hasType || !hasRole)) {
        return <Navigate to="/dashboard" replace/>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
