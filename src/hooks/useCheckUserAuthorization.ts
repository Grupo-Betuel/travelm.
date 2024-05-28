import {useMemo} from "react";
import IUser, {UserRoleTypes, UserTypes} from "../models/interfaces/user";
import {useAuth} from "../context/authContext";

export interface IUseCheckUserAuthorization {
    roles?: UserRoleTypes[];
    userTypes?: UserTypes[];
}

export const useCheckUserAuthorization = ({roles, userTypes}: IUseCheckUserAuthorization) => {
    const {user, token} = useAuth();

    const checkType = (types?: UserTypes[]) => !user || !types || types?.includes(user?.type as UserTypes);
    const checkRole = (rolesData?: UserRoleTypes[]) => !user || !rolesData || rolesData?.includes(user?.role as UserRoleTypes);

    const checkAuthorization = (rolesData?: UserRoleTypes[], types?: UserTypes[]) => {
        return checkRole(rolesData) && checkType(types);
    }

    const hasType = useMemo(() =>
            checkType(userTypes),
        [user, userTypes]);

    const hasRole = useMemo(() =>
            checkRole(roles),
        [user, userTypes]);


    return {
        hasType,
        hasRole,
        token,
        user,
        checkType,
        checkRole,
        checkAuthorization,
    }
}