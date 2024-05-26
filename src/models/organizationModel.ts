import {ISocialNetwork} from "./ISocialNetwork";
import {IMedia} from "./mediaModel";
import {IContact} from "./contactModel";
import {IReview} from "./reviewsModel";
import {BaseModel} from "./interfaces/BaseModel";
import {IBedroom} from "./bedroomModel";
import {IFinance} from "./financeModel";

export interface IOrganization extends BaseModel {
    type: 'church' | 'company' | 'transport' | 'restaurant' | 'hotel' | 'tourist-spot' | 'agency';
    name: string;
    email: string;
    description: string;
    logo: IMedia;
    socialNetworks: ISocialNetwork[];
    medias: IMedia[];
    contact: IContact;
    reviews: IReview[];
    bedrooms: IBedroom[];
    entryFee?: IFinance
}
