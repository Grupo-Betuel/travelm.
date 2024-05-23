import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://grupo-betuel-api.click/api',
});

export default axiosInstance;
