import React from 'react';
import {UserRoleTypes, UserTypes} from "../models/interfaces/userModel";
import {useCheckUserAuthorization} from "../hooks/useCheckUserAuthorization";

interface ProtectedElementProps {
    roles?: UserRoleTypes[];
    userTypes?: UserTypes[];
    children: React.ReactNode;
    condition?: boolean;
}

const ProtectedElement: React.FC<ProtectedElementProps> = ({roles, condition, children, userTypes}) => {
    const {hasType, hasRole, token, user} = useCheckUserAuthorization({roles, userTypes});
    if (!token) {
        return null;
    }

    if (token && (!hasType || !hasRole)) {
        return null;
    }


    if (condition === false) {
        return null;
    }

    return children;
};

export default ProtectedElement;
