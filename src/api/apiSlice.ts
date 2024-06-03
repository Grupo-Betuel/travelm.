import {createApi, BaseQueryFn} from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from './axiosBaseQuery';
import {EntityNames} from "../models/entitiyModels";
import Cookies from "js-cookie";
import {getToken} from "../utils/auth.utils";
// Creating a base query with Axios instead of fetch
export const appBaseQuery = axiosBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API as string,
});


// TODO: revalidate cache on token change
const baseQueryWithReauth: (path: string) => BaseQueryFn = (path: EntityNames) => async (args, api, extraOptions) => {
    let result = await appBaseQuery(args, api, extraOptions);
    const token = getToken();
    // !== api.getState()?.auth?.token
    if (!token) {
        // Aquí se puede manejar la invalidación cuando el token cambie.
        api.dispatch(apiSlice('organizations').util.invalidateTags(['LIST']));
    }

    return result;
};


export const apiSlice = (path: EntityNames) => createApi({
    reducerPath: path,
    tagTypes: [path],
    baseQuery: baseQueryWithReauth(path),
    endpoints: (builder) => ({})
});