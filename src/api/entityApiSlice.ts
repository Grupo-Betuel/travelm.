import {apiSlice} from './apiSlice';
import {BaseModel} from "../models/interfaces/BaseModel";
import {EntityNames} from "../models/entitiyModels";
import {IPathDataParam, IQueryDataParam} from "../models/common";

function createEntityApiSlice<T extends BaseModel>(entityName: EntityNames) {
    return apiSlice(entityName).injectEndpoints({
        endpoints: (builder) => ({
            fetchAll: builder.query<T[], T | void>({
                query: (data?: T) => ({
                    url: `/${entityName}${data ? `?${new URLSearchParams(data as any)}` : ''}`,
                    method: 'GET',
                    data: data,
                    query: data,
                }),
                transformResponse: (response: T[]) => response,
                providesTags: (result) => result
                    ? [...result.map(({_id}: BaseModel) => ({type: entityName, id: _id})), {
                        type: entityName,
                        id: 'LIST'
                    }]
                    : [{type: entityName, id: 'LIST'}],
                extraOptions: {
                    fixedCacheKey: `${entityName}-fetchAll`,
                },
            }),
            fetchById: builder.query<T, string>({
                query: (id) => id ? ({
                    url: `/${entityName}/${id}`,
                    method: 'GET',
                    data: {} as T,
                    name: entityName,
                    key: entityName,
                }) : null,
                transformResponse: (response: T) => response,
                extraOptions: {
                    fixedCacheKey: `${entityName}-fetchById`,
                },
                providesTags: (result, error, id) => [{ type: entityName, id }],
            }),
            add: builder.mutation<T, (T & IPathDataParam) | (T & IPathDataParam)[]>({
                query: (newData: (T & IPathDataParam) | (T & IPathDataParam)[]) => ({
                    url: `/${entityName}${!Array.isArray(newData) ? newData.path ? `/${newData.path}` : '' : ''}`,
                    method: 'POST',
                    data: Array.isArray(newData) ? newData : {
                        ...newData,
                        queryData: undefined,
                        path: undefined,
                    },
                }),
                transformResponse: (response: T) => response,
                // invalidatesTags: [{type: entityName, id: '_id'}],
                invalidatesTags: [{ type: entityName, id: 'LIST' }],
                extraOptions: {
                    fixedCacheKey: `${entityName}-add`,
                },
            }),
            update: builder.mutation<T, Partial<T> & Required<BaseModel> & IQueryDataParam>({
                query: (data: Partial<T> & Required<BaseModel> & IQueryDataParam) => ({
                    url: `/${entityName}${data.queryData ? `?${new URLSearchParams(data.queryData)}` : ''}`,
                    method: 'PUT',
                    data: {
                        ...data,
                        queryData: undefined,
                    },
                }),
                transformResponse: (response: T) => response,
                // invalidatesTags: (result, error, {_id: id}) => [{type: entityName, id}],
                extraOptions: {
                    fixedCacheKey: `${entityName}-update`,
                },
                invalidatesTags: (result, error, { _id }) => [{ type: entityName, id: _id }],

            }),
            delete: builder.mutation<T, string>({
                query: (id: string) => ({
                    url: `/${entityName}/${id}`,
                    method: 'DELETE',
                    data: {id},
                }),
                transformResponse: (response: T) => response,
                // invalidatesTags: (result, error, id) => [{type: entityName, id}],
                invalidatesTags: (result, error, id) => [{ type: entityName, id }],

                extraOptions: {
                    fixedCacheKey: `${entityName}-delete`,
                },
            }),
        }),
        overrideExisting: false,
    });
};

export default createEntityApiSlice;
