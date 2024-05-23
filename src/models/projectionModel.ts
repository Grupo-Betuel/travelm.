import {IFinance} from "./financeModel";
import {IClient} from "./clientModel";
import {BaseModel} from "./interfaces/BaseModel";

export interface IProjection extends BaseModel {
    finance?: IFinance;
    clients: number;
    date: Date;
    done: boolean;
}
