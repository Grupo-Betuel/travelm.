import React from 'react';
import {UserRoleTypes, UserTypes} from "../models/interfaces/userModel";
import {useCheckUserAuthorization} from "../hooks/useCheckUserAuthorization";

interface ProtectedElementProps {
    roles?: UserRoleTypes[];
    userTypes?: UserTypes[];
    children: React.ReactNode;
}

const ProtectedElement: React.FC<ProtectedElementProps> = ({roles, children, userTypes}) => {
    const {hasType, hasRole, token, user} = useCheckUserAuthorization({roles, userTypes});
    if (!token) {
        return null;
    }

    if (token && (!hasType || !hasRole)) {
        return null;
    }

    return children;
};

export default ProtectedElement;
