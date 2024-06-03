import React from "react";
import Cookies from "js-cookie";
import {getCrudService} from "../api/services/CRUD.service";
import IUser from "../models/interfaces/userModel";
import {useNavigate} from "react-router-dom";
import {AUTH_CONSTANT} from "../constants/auth.constant";

const userService = getCrudService('travelUsers');

export const useLogin = () => {
    const [addUser] = userService.useAddTravelUsers();
    const navigate = useNavigate();

    const login = async (auth: Pick<IUser, 'email' | 'password'>) => {
        const {data} = await addUser({...auth, path: 'login'} as any);
        const token = (data as any).token;

        if (token) {
            Cookies.set(AUTH_CONSTANT.TOKEN_KEY, token);
            navigate('');
        } else {
            console.log('Error logging in');
        }
    }

    return {login};
}