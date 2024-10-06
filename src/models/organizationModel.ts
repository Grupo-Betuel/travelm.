import {ISocialNetwork} from "./ISocialNetwork";
import {IMedia} from "./mediaModel";
import {IContact} from "./contactModel";
import {IReview} from "./reviewsModel";
import {BaseModel} from "./interfaces/BaseModel";
import {IBedroom} from "./bedroomModel";
import {IFinance} from "./financeModel";

export enum OrganizationTypesEnum {

    CHURCH = 'church',
    COMPANY = 'company',
    TRANSPORT = 'transport',
    RESTAURANT = 'restaurant',
    HOTEL = 'hotel',
    TOURIST_SPOT = 'tourist-spot',
    AGENCY = 'agency',
}

export interface IOrganization extends BaseModel {
    type: OrganizationTypesEnum;
    name: string;
    description: string;
    logo: IMedia;
    socialNetworks: ISocialNetwork[];
    medias: IMedia[];
    contact: IContact;
    reviews: IReview[];
    bedrooms?: IBedroom[];
    entryFee?: IFinance;
    sessionId?: string;
}


export const organizationTypeList: OrganizationTypesEnum[] = [
    OrganizationTypesEnum.CHURCH,
    OrganizationTypesEnum.COMPANY,
    OrganizationTypesEnum.TRANSPORT,
    OrganizationTypesEnum.RESTAURANT,
    OrganizationTypesEnum.HOTEL,
    OrganizationTypesEnum.TOURIST_SPOT,
    OrganizationTypesEnum.AGENCY,
]
