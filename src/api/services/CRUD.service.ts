import createEntityApiSlice from "../entityApiSlice";
import {EntityModels, EntityNames} from "../../models/entitiyModels";
import {BaseModel} from "../../models/interfaces/BaseModel";
import {EntityApiStores, RootState} from "../../store/store";
import {TypedUseQuery, UseQuery} from "@reduxjs/toolkit/query/react";
import {QueryDefinition} from '@reduxjs/toolkit/query';

// import {capitalize} from "@reduxjs/toolkit/dist/query/utils";

export type UpdateAction<Entity, Action> = {
    [N in `useUpdate${Capitalize<Entity>}`]: Action;
}

export type DeleteAction<Entity, Action> = {
    [N in `useDelete${Capitalize<Entity>}`]: Action;
}

export type FetchAllAction<Entity, Action> = {
    [N in `useFetchAll${Capitalize<Entity>}`]: Action;
}

export type FetchByIdAction<Entity, Action> = {
    [N in `useFetchById${Capitalize<Entity>}`]: Action;
}

export type DynamicCrudService<T extends EntityNames, UseAdd, UseUpdate, UseFetchAll, UseFetchById, UseDelete> =
    {
        [N in `useAdd${Capitalize<T>}`]: UseAdd;
    }
    & UpdateAction<T, UseUpdate>
    & DeleteAction<T, UseDelete>
    & FetchAllAction<T, UseFetchAll>
    & FetchByIdAction<T, UseFetchById>;


interface QueryResult<T> {
    data?: T[];
    // Add other properties typical for results like error, loading states, etc.
}

export type ICustomQueryOptions<T> = {
    skip?: boolean;
    pollingInterval?: number;
    refetchOnMountOrArgChange?: boolean;
    refetchOnReconnect?: boolean;
    refetchOnFocus?: boolean;
    selectFromResult?: (result: QueryResult<T>) => QueryResult<T>;
}

export function getCrudService<T extends EntityNames>(
    // Pass T directly as the type parameter
    entityName: T
) {
    const entityApi = EntityApiStores[entityName];
    const capEntityName = entityName.charAt(0).toUpperCase() + entityName.slice(1);

    // console.log(entityApi)
    const addMutation = entityApi.useAddMutation;
    const updateMutation = entityApi.useUpdateMutation;

    const deleteMutation = entityApi.useDeleteMutation;

    const fetchAllQuery = (
        data?: any,
        options?: ICustomQueryOptions<EntityModels[T]>
    ) =>
        entityApi.useFetchAllQuery(data, options)

    const fetchByIdQuery = entityApi.useFetchByIdQuery;

    return {
        [`useAdd${capEntityName}`]: addMutation,
        [`useUpdate${capEntityName}`]: updateMutation,
        [`useFetchAll${capEntityName}`]: fetchAllQuery,
        [`useFetchById${capEntityName}`]: fetchByIdQuery,
        [`useDelete${capEntityName}`]: deleteMutation,
    } as DynamicCrudService<
        T,
        typeof addMutation,
        typeof updateMutation,
        typeof fetchAllQuery,
        typeof fetchByIdQuery,
        typeof deleteMutation
    >
}
