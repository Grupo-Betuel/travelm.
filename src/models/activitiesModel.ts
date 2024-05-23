import {IMedia} from "./mediaModel";
import {IFinance} from "./financeModel";
import {BaseModel} from "./interfaces/BaseModel";

export interface IActivity extends BaseModel {
    title: string;
    images: IMedia[];
    videos: IMedia[];
    date: Date;
    finance?: IFinance;
    description: string;
}
