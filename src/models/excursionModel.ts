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

export type ExcursionDetailActions = 'remove-client' | 'add-client' | 'update-client' | 'update';
export type ExcursionDetailActionsDataTypes = IClient | Partial<IExcursion> | Partial<IClient>[];
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
}





