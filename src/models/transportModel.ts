import {IOrganization} from "./organizationModel";
import {ITransportResource} from "./transportResourcesModel";

export interface ITransport {
    organization: IOrganization;
    transportResources: ITransportResource[];
}
