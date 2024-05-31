import IUser from "./interfaces/userModel";
import {IFinance} from "./financeModel";
import {BaseModel} from "./interfaces/BaseModel";

export interface IBus  extends BaseModel {
    model: string;
    capacity: number;
    color: string;
    description: string;
}
