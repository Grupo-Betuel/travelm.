import {IService} from "./serviceModel";
import {ISocialNetwork} from "./ISocialNetwork";
import {BaseModel} from "./interfaces/BaseModel";

export interface IClient extends BaseModel {
    firstName: string;
    lastName: string;
    phone: string;
    stage?: string;
    email: string;
    services: IService[];
    socialNetworks: ISocialNetwork[];
    relatedCompanies?: string,
}
