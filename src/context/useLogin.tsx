import React from "react";
import Cookies from "js-cookie";
import {getCrudService} from "../api/services/CRUD.service";
import IUser from "../models/interfaces/user";
import {useNavigate} from "react-router-dom";

const userService = getCrudService('travelUsers');

export const useLogin = () => {
    const [addUser] = userService.useAddTravelUsers();
    const navigate = useNavigate();

    const login = async (auth: Pick<IUser, 'email' | 'password'>) => {
        const {data} = await addUser({...auth, path: 'login'} as any);
        const token = (data as any).token;
        console.log('data', data);

        if (token) {
            Cookies.set('token', token);
            navigate('/dashboard/home');
        } else {
            console.log('Error logging in');
        }
    }

    return {login};
}