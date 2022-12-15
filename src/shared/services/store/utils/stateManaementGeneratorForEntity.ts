import { Dispatch } from "redux";
import { createSlice, PayloadAction, combineReducers } from "@reduxjs/toolkit";
import { CreateSliceOptions } from "@reduxjs/toolkit/src/createSlice";
import { asLiterals } from "../../../../utils/types.util";
import { apiCall } from "@services/apiCall";
import {
  RESTApiType,
  IRESTEndpointStructure,
} from "@interfaces/REST-interface.ts";

/*stateManagementGeneratorForEntity, return an object with 3 properties for the state managment of that entity
 * these are (reducer, actions, api) each property is a CRUD based un the 4 HTTP method (post, get, update, delete)
 * @param endpoints: an object with the endpoint for each CRUD method
 * @param entityAndReducerName: name of the entity to be automated, this name must be the same of the property inside the app state object
 * */

export class CommonCrudEndpoints {
  get: IRESTEndpointStructure = { method: "post", path: "" };
  post: IRESTEndpointStructure = { method: "post", path: "" };
  delete: IRESTEndpointStructure = { method: "post", path: "" };
  update: IRESTEndpointStructure = { method: "post", path: "" };
}

export class CommonEntityStructure<T> {
  data: T = {} as T;
  error: any = "Error!";
  loading?: boolean;
}

export type CommonReducerMethods<T> = {
  loading: (
    state: CommonEntityStructure<T> | any,
    action: PayloadAction
  ) => void;
  success: (
    state: CommonEntityStructure<T> | any,
    action: PayloadAction<T>
  ) => void;
  error: (
    state: CommonEntityStructure<T> | any,
    action: PayloadAction<T>
  ) => void;
};

function stateManagementGeneratorForEntity<
  Endpoints extends CommonCrudEndpoints,
  Entity
>(endpoints: Endpoints = new CommonCrudEndpoints() as any, entityName: string) {
  const allEndpointsArr: (keyof Endpoints)[] = Array.from(
    new Set([...["post", "get", "update", "delete"], ...Object.keys(endpoints)])
  ) as (keyof Endpoints)[];

  const methods = asLiterals<keyof Endpoints>(allEndpointsArr);

  type ActionTypes = typeof methods[number];

  type InitialStateType = {
    [N in ActionTypes]: CommonEntityStructure<Entity>;
  };

  // initial state according to the crud structure end other endpoints
  const initialState: InitialStateType = {} as any;

  allEndpointsArr.forEach((endpoint) => {
    initialState[endpoint] = new CommonEntityStructure();
  });

  type ReducerType = {
    [K in ActionTypes]: (
      state: CommonEntityStructure<Entity>,
      action: PayloadAction<Entity>
    ) => any;
  };

  const slice: CreateSliceOptions<
    InitialStateType,
    CommonReducerMethods<Entity>,
    string
  > = {
    name: entityName,
    initialState,
    reducers: {} as any,
  };

  type StateManagementType = {
    slice: typeof slice;
    api: { [K in ActionTypes]: RESTApiType<Entity> };
  };
  const stateManagementData: StateManagementType = { slice, api: {} as any };

  const reducers:  = {} as any;

  methods.forEach((method) => {
    // generating the actions for each method { post, get, update, delete }
    // stateManagementData.actions[method] = {
    //   loading: `${entityName}_${method.toUpperCase()}_LOADING`,
    //   error: `${entityName}_${method.toUpperCase()}_ERROR`,
    //   success: `${entityName}_${method.toUpperCase()}_SUCCESS`,
    // };

    reducers[method] = {
      loading: (
        state: CommonEntityStructure<Entity>,
        action: PayloadAction
      ) => {
        state.loading = true;
      },
      success: (
        state: CommonEntityStructure<Entity>,
        action: PayloadAction<Entity>
      ) => {
        state.loading = false;
        state.data = action.payload;
      },
      error: (
        state: CommonEntityStructure<Entity>,
        action: PayloadAction<Entity>
      ) => {
        state.loading = false;
        state.error = action.payload;
      },
    };
    slice.reducers = reducers;
    // generating the reducer for each method { post, get, update, delete }
    // stateManagementData.reducer[method] = (state = {}, action = {}) => {
    //   switch (action.type) {
    //     case stateManagementData.actions[method].loading: {
    //       return {
    //         loading: true,
    //       };
    //     }
    //     case stateManagementData.actions[method].success: {
    //       const { result } = action.payload;
    //       return {
    //         result,
    //         loading: false,
    //       };
    //     }
    //     case stateManagementData.actions[method].error: {
    //       const { error } = action.payload;
    //
    //       return {
    //         error,
    //         loading: false,
    //       };
    //     }
    //     default: {
    //       return state;
    //     }
    //   }
    // };

    // just add the api method if the endpoint related to that method is supplied

    if (endpoints[method]) {
      stateManagementData.api[method] =
        (data?: Entity) => (dispatch: Dispatch) => {
          // dispatch({
          //   type: stateManagementData.actions[method].loading
          // });
          entitySlice.actions.loading();
          const endpoint: IRESTEndpointStructure = endpoints[method];
          apiCall(data, endpoint.method, endpoint.path).then((res) => {
            const { error, data } = res.data || {};

            if (!error) {
              entitySlice.actions.success(data);
              // return dispatch({
              //   type: stateManagementData.actions[method].success,
              //   payload: { result },
              // });
            } else {
              entitySlice.actions.error(error);
            }
          });
        };
    }
  });
  const entitySlice = createSlice(slice);

  // combining the reducers autogenerated { post, get, update, delete }
  return stateManagementData;
}

export default stateManagementGeneratorForEntity;
