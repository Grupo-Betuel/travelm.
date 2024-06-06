import {BaseModel} from "./interfaces/BaseModel";
import {IMedia, IMediaFile} from "./mediaModel";

export type PaymentTypes = 'card' | 'transfer' | 'cash'
export interface IPayment extends BaseModel {
    type: PaymentTypes;
    date: Date;
    amount: number;
    comment?: string;
    media?: IMedia | IMediaFile;
}

export const paymentTypes: PaymentTypes[] = ['card', 'transfer', 'cash']
export const paymentTypeLabels: Record<PaymentTypes, string> = {
    card: 'Tarjeta',
    transfer: 'Transferencia',
    cash: 'Efectivo'
}