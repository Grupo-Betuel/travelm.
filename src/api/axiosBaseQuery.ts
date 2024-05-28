import {AxiosRequestConfig} from 'axios';
import {BaseQueryFn} from '@reduxjs/toolkit/query/react';
import axiosInstance from "./axios.service";

const axiosBaseQuery =
    (
        {baseUrl}: { baseUrl?: string },
    ): BaseQueryFn<
        {
            url: string;
            method: AxiosRequestConfig['method'];
            data?: AxiosRequestConfig['data'];
            params?: AxiosRequestConfig['params'];
        },
        unknown,
        unknown
    > =>
        async ({url, method, data, params}) => {
            try {
                const result = await axiosInstance({
                    url: baseUrl + url,
                    method,
                    data,
                    params,
                });

                return {data: result.data};
            } catch (axiosError) {
                let err = axiosError as any;
                return {
                    error: {
                        status: err.response?.status,
                        data: err.response?.data || err.message,
                    },
                };
            }
        };

export default axiosBaseQuery;
