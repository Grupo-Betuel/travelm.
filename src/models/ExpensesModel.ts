import {IFinance} from "@/models/financeModel";
import {BaseModel} from "@/models/interfaces/BaseModel";

export interface IExpense extends BaseModel {
    finance: IFinance;
    title: string;
    description: string;
    createDate: Date;
    updateDate: Date;
}