export type FinanceTypes = 'transport' | 'food' | 'excursion' | 'resort' | 'service' | 'flight' | 'tourist-spot'

export const financeTypes = ['transport', 'food', 'excursion', 'resort', 'service', 'flight', 'tourist-spot']
export interface IFinance {
    price: number;
    children?: number;
    couples?: number;
    cost?: number;
    type: FinanceTypes;
}
