import {configureStore} from '@reduxjs/toolkit';
import {apiSlice} from '../api/apiSlice';
import createEntityApiSlice from "../api/entityApiSlice";
import {BaseModel} from "../models/interfaces/BaseModel";
import {IContact} from "../models/contactModel";
import {EntityNames, EntityStores} from "../models/entitiyModels";
import {IOrganization} from "../models/organizationModel";
import {IReview} from "../models/reviewsModel";
import {ITransport} from "../models/transportModel";
import {IFinance} from "../models/financeModel";
import {IProjection} from "../models/projectionModel";
import {IFood} from "../models/foodModel";
import {IBedroom} from "../models/bedroomModel";
import {IExcursion} from "../models/excursionModel";
import {IComment} from "../models/commentModel";
import {ICheckpoint} from "../models/checkpointModel";
import {IBus} from "../models/busesModel";
import {IActivity} from "../models/activitiesModel";
import {IService} from "../models/serviceModel";
import {IPayment} from "../models/PaymentModel";
import {IMedia} from "../models/mediaModel";
import {IClient} from "../models/clientModel";
import IUser from "../models/interfaces/userModel";
import {ITransportResource} from "../models/transportResourcesModel";
import {IExpense} from "@/models/ExpensesModel";
import {ISocialNetwork} from "@/models/ISocialNetwork";

export const EntityApiStores: EntityStores = {
    contacts: createEntityApiSlice<IContact & BaseModel>('contacts'),
    organizations: createEntityApiSlice<IOrganization & BaseModel>('organizations'),
    reviews: createEntityApiSlice<IReview & BaseModel>('reviews'),
    transports: createEntityApiSlice<ITransport & BaseModel>('transports'),
    finances: createEntityApiSlice<IFinance & BaseModel>('finances'),
    projections: createEntityApiSlice<IProjection & BaseModel>('projections'),
    foods: createEntityApiSlice<IFood & BaseModel>('foods'),
    bedrooms: createEntityApiSlice<IBedroom & BaseModel>('bedrooms'),
    excursions: createEntityApiSlice<IExcursion & BaseModel>('excursions'),
    comments: createEntityApiSlice<IComment & BaseModel>('comments'),
    checkpoints: createEntityApiSlice<ICheckpoint & BaseModel>('checkpoints'),
    buses: createEntityApiSlice<IBus & BaseModel>('buses'),
    activities: createEntityApiSlice<IActivity & BaseModel>('activities'),
    services: createEntityApiSlice<IService & BaseModel>('services'),
    payments: createEntityApiSlice<IPayment & BaseModel>('payments'),
    travelExpenses: createEntityApiSlice<IExpense>('travelExpenses'),
    medias: createEntityApiSlice<IMedia & BaseModel>('medias'),
    travelClients: createEntityApiSlice<IClient>('travelClients'),
    travelUsers: createEntityApiSlice<IUser & BaseModel>('travelUsers'),
    transportResources: createEntityApiSlice<ITransportResource & BaseModel>('transportResources'),
    socialNetworks: createEntityApiSlice<ISocialNetwork & BaseModel>('socialNetworks'),
}

const storeReducer: any = {};

const storeMiddleware: any = [];

(Object.keys(EntityApiStores) as EntityNames[]).forEach((key: EntityNames) => {
    const {reducer, middleware, reducerPath} = EntityApiStores[key];
    storeReducer[reducerPath] = reducer;
    storeMiddleware.push(middleware);
});

export const appStore = configureStore({
    reducer: {
        ...storeReducer,
        // [EntityApiStores.contacts.reducerPath]: EntityApiStores.contacts.reducer,
        // [EntityApiStores.organizations.reducerPath]: EntityApiStores.organizations.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(...storeMiddleware),
});

// EntityApiStores.contacts.middleware,

// EntityApiStores.organizations.middleware,


export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
