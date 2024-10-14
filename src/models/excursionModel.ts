import {IOrganization} from "./organizationModel";
import {IClient} from "./clientModel";
import {ICheckpoint} from "./checkpointModel";
import {IMedia} from "./mediaModel";
import {IActivity} from "./activitiesModel";
import {IReview} from "./reviewsModel";
import {IFinance} from "./financeModel";
import {ITransport} from "./transportModel";
import {IFood} from "./foodModel";
import {IProjection} from "./projectionModel";
import {BaseModel} from "./interfaces/BaseModel";
import {IBedroom} from "./bedroomModel";
import {IExpense} from "@/models/ExpensesModel";
import {IService} from "@/models/serviceModel";
import {IExcursionConfiguration} from "@/models/ExcursionConfigurationModels";

export type ExcursionDetailActions = 'remove-client' | 'add-client' | 'update-client' | 'update' | 'update-service' | 'update-expense' | 'delete-expense';
export type ExcursionDetailActionsDataTypes = IClient | Partial<IExcursion> | Partial<IClient>[] | Partial<IService>;
export enum ExcursionStatusEnum {
    DRAFT = 'draft',
    COMPLETED = 'completed',
    ENDED = 'ended'
}

export interface IExcursion extends BaseModel {
    title: string;
    description: string;
    destinations: IOrganization[];
    organizations: IOrganization[];
    owner: IOrganization;
    clients: IClient[];
    configuration: IExcursionConfiguration;
    finance: IFinance;
    checkpoints: ICheckpoint[];
    flyer: IMedia;
    images: IMedia[];
    videos: IMedia[];
    audios: IMedia[];
    activities: IActivity[];
    reviews: IReview[];
    transport: ITransport;
    foods: IFood[];
    projections: IProjection[];
    bedrooms: IBedroom[];
    startDate: Date;
    endDate: Date;
    whatsappGroupID?: string;
    status: ExcursionStatusEnum;
    expenses?: IExpense[];
}





