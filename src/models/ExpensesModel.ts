import {IFinance} from "@/models/financeModel";
import {BaseModel} from "@/models/interfaces/BaseModel";
import {IMedia} from "@/models/mediaModel";

export interface IExpense extends BaseModel {
    finance: IFinance;
    title: string;
    description: string;
    medias?: IMedia[];
    createDate: Date;
    updateDate: Date;
}
