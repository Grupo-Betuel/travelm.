import {IFinance} from "./financeModel";
import {IPayment} from "./PaymentModel";
import {ExcursionDetailActions, ExcursionDetailActionsDataTypes, IExcursion} from "./excursionModel";
import {IBedroom} from "./bedroomModel";
import {BaseModel} from "./interfaces/BaseModel";
import {IOption} from "../components/SearchableSelect";
import {IComment} from "@/models/commentModel";

export type ServiceStatusTypes = 'paid' | 'reserved' | 'interested' | 'canceled' | 'free';
export type ServiceTypes = 'excursion' | 'flight' | 'resort' | 'hotel';

export type ServiceDetailActions = 'delete-payment'
export type ServiceDetailActionsDataTypes = IPayment

export interface IService extends BaseModel {
    status: ServiceStatusTypes;
    payments: IPayment[];
    bedroom?: IBedroom;
    type: ServiceTypes;
    finance: IFinance;
    serviceId?: string;
    excursionId?: string;
    comments?: IComment[];
    seats: number;
}

export const serviceStatusLabels: { [N in ServiceStatusTypes]: string } = {
    paid: 'Pagado',
    reserved: 'Reservado',
    interested: 'Interesado',
    canceled: 'Cancelado',
    free: 'Gratis'
}
export const serviceStatusList: IOption<ServiceStatusTypes>[] = [
    {value: 'reserved', label: serviceStatusLabels.reserved},
    {value: 'paid', label: serviceStatusLabels.paid},
    {value: 'interested', label: serviceStatusLabels.interested},
    {value: 'free', label: serviceStatusLabels.free},
    {value: 'canceled', label: serviceStatusLabels.canceled},
]