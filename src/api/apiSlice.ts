import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from './axiosBaseQuery';
import {EntityNames} from "../models/entitiyModels";

// Creating a base query with Axios instead of fetch
const baseQuery = axiosBaseQuery({ baseUrl: 'https://grupo-betuel-api.click/api' });

export const apiSlice = (path: EntityNames) => createApi({
    reducerPath: path,
    baseQuery: baseQuery,
    endpoints: (builder) => ({})
});