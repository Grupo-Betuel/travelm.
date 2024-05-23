import {BaseModel} from "./interfaces/BaseModel";

export interface IBedroom extends BaseModel {
    capacity: number;
    name: string;
    zone: string;
    level: number;
    occupiedQuantity?: number; // this is not in the database
}