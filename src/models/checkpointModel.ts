import {IBus} from "./busesModel";
import {ILocation} from "./ordersModels";
import {BaseModel} from "./interfaces/BaseModel";

export interface ICheckpoint extends BaseModel{
    // eslint-disable-next-line no-undef
    location: ILocation;
    description: string;
    buses: IBus[];
}
