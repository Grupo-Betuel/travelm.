import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {useAuth} from "../context/authContext";

interface PublicOnlyProps {
    children: React.ReactNode;
}

const PublicOnly: React.FC<PublicOnlyProps> = ({children}) => {
    const {token} = useAuth();
    if (!!token) {
        return <Navigate to="/dashboard" replace/>;
    }

    return children;
};

export default PublicOnly;
