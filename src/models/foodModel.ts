import {IOrganization} from "./organizationModel";
import {IFinance} from "./financeModel";
import {IMedia} from "./mediaModel";
import {BaseModel} from "./interfaces/BaseModel";

export type FoodTypes = 'desert' | 'lunch' | 'snack'
export interface IFood  extends BaseModel {
    organization: IOrganization;
    finance: IFinance;
    images: IMedia[];
    menu: string;
    type: FoodTypes;
}
