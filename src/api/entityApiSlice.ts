import {apiSlice} from './apiSlice';
import {BaseModel} from "../models/interfaces/BaseModel";
import {EntityModelTypes, EntityNames} from "../models/entitiyModels";
import {IQueryDataParam} from "../models/common";


function createEntityApiSlice<T extends BaseModel>(entityName: EntityNames) {
    // const customSlice = apiSlice();
    return apiSlice(entityName).injectEndpoints({
        endpoints: (builder) => ({
            fetchAll: builder.query({
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
            }),
            fetchById: builder.query({
                query: (id) => id ? ({
                    url: `/${entityName}/${id}`,
                    method: 'GET',
                    data: {} as T,
                }) : null,
                transformResponse: (response: T) => response,
            }),
            add: builder.mutation({
                query: (newData: T) => ({
                    url: `/${entityName}`,
                    method: 'POST',
                    data: newData,
                }),
                transformResponse: (response: T) => response,
                invalidatesTags: [{type: entityName, id: 'LIST'}],
            }),
            update: builder.mutation({
                query: (data: Partial<T> & Required<BaseModel> & IQueryDataParam) => ({
                    url: `/${entityName}${data.queryData ? `?${new URLSearchParams(data.queryData)}` : ''}`,
                    method: 'PUT',
                    data: {
                        ...data,
                        queryData: undefined,
                    },
                }),
                transformResponse: (response: T) => response,
                invalidatesTags: (result, error, {_id: id}) => [{type: entityName, id}],
            }),
            delete: builder.mutation({
                query: (id: string) => ({
                    url: `/${entityName}/${id}`,
                    method: 'DELETE',
                    data: {id},
                }),
                transformResponse: (response: T) => response,
                invalidatesTags: (result, error, id) => [{type: entityName, id}],
            }),
        }),
        overrideExisting: false,
    });

    // return entityApiSlice;
};

export default createEntityApiSlice;