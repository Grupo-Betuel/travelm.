import IUser from "./interfaces/user";
import {IFinance} from "./financeModel";
import {BaseModel} from "./interfaces/BaseModel";

export interface IBus  extends BaseModel {
    model: string;
    driver: IUser; // Assuming there is a User model.
    capacity: number;
    color: string;
    description: string;
    finance: IFinance;
}
