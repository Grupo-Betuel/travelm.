import {BaseModel} from "./interfaces/BaseModel";

export type PaymentTypes = 'card' | 'transfer' | 'cash'
export interface IPayment extends BaseModel {
    type: PaymentTypes;
    date: Date;
    amount: number;
    comment?: string;
}
