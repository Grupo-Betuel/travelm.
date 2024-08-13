import IUser from "./interfaces/userModel";
import {IFinance} from "./financeModel";
import {BaseModel} from "./interfaces/BaseModel";
import {IBus} from "./busesModel";
import {IOption} from "@/components/SearchableSelect";

export interface ITransportResource extends BaseModel {
    driver: IUser;
    finance: IFinance;
    bus: IBus;
}

export const busesLabels: {[K in keyof IBus] : string} = {
    model: 'Modelo',
    capacity: 'Capacidad',
    color: 'Color',
    description: 'Descripción',
}

export const busList: IOption<keyof IBus>[] = [
    {value: 'model', label: busesLabels.model},
    {value: 'capacity', label: busesLabels.capacity},
    {value: 'color', label: busesLabels.color},
    {value: 'description', label: busesLabels.description},
]
