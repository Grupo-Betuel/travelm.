import {createSelector} from '@reduxjs/toolkit';
import {EntityApiStores, RootState} from "../store";
import {EntityNames} from "../../models/entitiyModels";

const createIsLoadingSelector = (entityName: EntityNames) => (state: RootState) => {
    const entityStore = EntityApiStores[entityName];

    if (entityStore && entityStore.endpoints) {
        const isLoading = (Object.keys(entityStore.endpoints) as (keyof typeof entityStore.endpoints)[])
            .map((key) => {
                const selectorItem = (entityStore.endpoints[key]?.select as Function)();
                const stateData = selectorItem(state);
                const status = stateData.status;
                if(entityName === 'organizations') {
                    // console.log('state =>', state);
                }
                // console.log('state! =>', stateData);
                // console.log('state val! =>', state);
                // return status === 'pending'
                return stateData.isLoading;
            }).reduce((acc, curr) => acc || curr, false);
        return isLoading;
    }

    return false;
};

const createIsLoadingSelector2 = (entityName: EntityNames) => createSelector(
    (state: RootState) => state,
    (state) => {
        const entityStore = EntityApiStores[entityName];

        if (entityStore && entityStore.endpoints) {
            const isLoading = (Object.keys(entityStore.endpoints) as (keyof typeof entityStore.endpoints)[])
                .map((key) => {
                    const selectEndpoint = entityStore.endpoints[key].select as Function;
                    const stateData = selectEndpoint({} as any)(state);
                    console.log('key =')
                    return stateData?.status === 'pending';
                })
                .reduce((acc, curr) => acc || curr, false);
            return isLoading;
        }

        return false;
    }
);

const entityLoadingSelectors = (Object.keys(EntityApiStores) as EntityNames[]).map(createIsLoadingSelector);

export const selectIsAnyEntityLoading = createSelector(
    entityLoadingSelectors,
    (...loadingStates) => loadingStates.some(isLoading => isLoading)
);
