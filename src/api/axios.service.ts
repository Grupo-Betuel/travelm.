import axios from 'axios';
import Cookies from 'js-cookie';
import {AUTH_CONSTANT} from "../constants/auth.constant";

const axiosInstance = axios.create({
    baseURL: 'https://grupo-betuel-api.click/api',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get(AUTH_CONSTANT.TOKEN_KEY);
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
