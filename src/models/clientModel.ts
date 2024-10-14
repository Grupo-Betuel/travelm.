import {IService} from "./serviceModel";
import {SocialNetworkModels} from "./SocialNetworkModels";
import {BaseModel} from "./interfaces/BaseModel";

export interface IClient extends BaseModel {
    firstName: string;
    lastName: string;
    phone: string;
    stage?: string;
    email: string;
    services: IService[];
    currentService?: IService;
    socialNetworks: SocialNetworkModels[];
    relatedCompanies?: string,
}
