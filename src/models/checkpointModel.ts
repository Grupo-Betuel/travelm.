import {IBus} from "./busesModel";
import {ILocation} from "./ordersModels";
import {BaseModel} from "./interfaces/BaseModel";

export interface ICheckpoint extends BaseModel {
    location: ILocation;
    description: string;
    time: Date;
    buses: IBus[];
}
