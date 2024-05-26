import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import {AUTH_CONSTANT} from "../constants/auth.constant";

interface User {
    role: string;

    [key: string]: any;
}

interface AuthContextProps {
    user: User | null;
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
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | undefined>(Cookies.get(AUTH_CONSTANT.TOKEN_KEY));
    const tokenCookies = Cookies.get(AUTH_CONSTANT.TOKEN_KEY)

    useEffect(() => {
        if (token) {
            const decodedUser = jwtDecode<User>(token);
            setUser(decodedUser);
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
        const decodedUser = jwtDecode<User>(token);
        setUser(decodedUser);
    };

    const logout = () => {
        Cookies.remove(AUTH_CONSTANT.TOKEN_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
