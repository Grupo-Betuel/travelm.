import {IFinance} from "./financeModel";
import {IPayment} from "./PaymentModel";
import {ExcursionDetailActions, ExcursionDetailActionsDataTypes, IExcursion} from "./excursionModel";
import {IBedroom} from "./bedroomModel";
import {BaseModel} from "./interfaces/BaseModel";

export type ServiceStatusTypes = 'paid' | 'reserved' | 'interested';
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
}
