export type FinanceTypes = 'transport' | 'food' | 'excursion' | 'resort' | 'service' | 'flight' | 'tourist-spot'

export enum FinanceOptionEnum {
    COST = "cost",
    COUPLE = "couple",
    CHILDREN = "children",
}

export const financeTypes = ['transport', 'food', 'excursion', 'resort', 'service', 'flight', 'tourist-spot']
export interface IFinance {
    price: number;
    children?: number;
    couple?: number;
    cost?: number;
    type: FinanceTypes;
}
