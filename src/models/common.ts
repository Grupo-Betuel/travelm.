import {ECommerceTypes} from "../api/services/promotions";
import {IProductData} from "./products";
import {ServiceDetailActions, ServiceDetailActionsDataTypes} from "./serviceModel";
import {BaseModel} from "./interfaces/BaseModel";

export type ECommerceResponseStatusTypes = 'publishing' | 'published' | 'completed' | 'failed';

export class ECommerceResponse {
    loading?: boolean = false;

    status: ECommerceResponseStatusTypes;

    ecommerce: ECommerceTypes;

    publication?: IProductData;

    error?: string;

    constructor(object: ECommerceResponse) {
        this.loading = object.loading;
        this.status = object.status;
        this.ecommerce = object.ecommerce;
        this.publication = object.publication;
        this.error = object.error;
    }
}

export type CompanyTypes = 'betueltech' | 'betueldance' | 'betueltravel';

// export interface ICsd

export class ConstructorClass<T> {
    constructor(private data: Partial<T> = {} as any) {
        Object.keys({...data, ...this}).forEach(key => {
            (this as any)[key] = (data as any)[key] || (this as any)[key]
        });
    }
}

export type CommonActionTypes = 'update' | 'delete' | 'create';


export interface IStep<T> {
    label?: string;
    icon?: any;
    properties?: (keyof T)[];
    component: any;
    type?: keyof T;
}

export interface ICustomComponentDialog {
    open: boolean;
    handler: () => void;
}


export type CommonConfirmActions = 'delete' | 'update' | 'create';

export type CommonConfirmActionsDataTypes<T> = T;

export interface IQueryDataParam {
    queryData?: any;
}

export interface IPathDataParam {
    path?: string;
}

export interface ICaption {
    title?: string;
    subtitle?: string;
    endTitle?: string;
}