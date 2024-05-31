import IUser from "./interfaces/userModel";
import {IFinance} from "./financeModel";
import {BaseModel} from "./interfaces/BaseModel";
import {IBus} from "./busesModel";

export interface ITransportResource extends BaseModel {
    driver: IUser;
    finance: IFinance;
    bus: IBus;
}
