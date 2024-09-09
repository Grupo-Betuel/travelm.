import {BaseModel} from "./interfaces/BaseModel";
import {IFinance} from "./financeModel";
import {IContact} from "./contactModel";
import {IOrganization} from "./organizationModel";
import {IReview} from "./reviewsModel";
import {ITransport} from "./transportModel";
import {IProjection} from "./projectionModel";
import {IFood} from "./foodModel";
import {IBedroom} from "./bedroomModel";
import {IExcursion} from "./excursionModel";
import {IComments} from "./commentModel";
import {ICheckpoint} from "./checkpointModel";
import {IBus} from "./busesModel";
import {IActivity} from "./activitiesModel";
import {IService} from "./serviceModel";
import {IPayment} from "./PaymentModel";
import {IMedia} from "./mediaModel";
import {Api} from "@reduxjs/toolkit/query";
import {CreateApi} from "@reduxjs/toolkit/src/query/createApi";
import createEntityApiSlice from "../api/entityApiSlice";
import {IClient} from "./clientModel";
import IUser from "./interfaces/userModel";
import {ITransportResource} from "./transportResourcesModel";
import {ISocialNetwork} from "@/models/ISocialNetwork";
import {IExpense} from "@/models/ExpensesModel";

export type EntityModels = {
    finances: IFinance,
    projections: IProjection,
    organizations: IOrganization,
    socialNetworks: ISocialNetwork,
    reviews: IReview,
    transports: ITransport,
    foods: IFood,
    bedrooms: IBedroom,
    excursions: IExcursion,
    comments: IComments,
    checkpoints: ICheckpoint,
    buses: IBus,
    activities: IActivity,
    contacts: IContact,
    services: IService,
    payments: IPayment,
    travelExpenses: IExpense,
    medias: IMedia,
    travelClients: IClient,
    travelUsers: IUser,
    transportResources: ITransportResource,
}

export type EntityNames = keyof EntityModels;

export type EntityStores = {
    [N in EntityNames]: ReturnType<typeof createEntityApiSlice<EntityModels[N] & BaseModel>>
}

export type EntityModelTypes = {
    [N in EntityNames]: EntityModels[N] & BaseModel
}