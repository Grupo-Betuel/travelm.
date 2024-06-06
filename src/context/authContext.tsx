import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import {AUTH_CONSTANT} from "../constants/auth.constant";
import {useNavigate} from "react-router-dom";
import IUser from "../models/interfaces/userModel";

interface AuthContextProps {
    user: IUser | null;
    token?: string;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setIUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | undefined>(Cookies.get(AUTH_CONSTANT.TOKEN_KEY));
    const tokenCookies = Cookies.get(AUTH_CONSTANT.TOKEN_KEY)
    const navigate = useNavigate();


    useEffect(() => {
        if (token) {
            const decodedIUser = jwtDecode<IUser>(token);
            setIUser(decodedIUser);
        } else {
            // todo: redirect to login page
        }

    }, [token]);

    useEffect(() => {
        if (tokenCookies) {
            setToken(tokenCookies);
        }
    }, [tokenCookies]);

    const login = (token: string) => {
        Cookies.set(AUTH_CONSTANT.TOKEN_KEY, token);
        const decodedIUser = jwtDecode<IUser>(token);
        setIUser(decodedIUser);
    };

    const logout = () => {
        Cookies.remove(AUTH_CONSTANT.TOKEN_KEY);
        setIUser(null);
        setToken(undefined);
        location.href = '/';
        // navigate('/auth/sign-in', {replace: true });
    };

    return (
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
