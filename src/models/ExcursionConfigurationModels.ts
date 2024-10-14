import {IMedia} from "@/models/mediaModel";

export enum ExcursionConfigTypeEnum {
    PROMOTION = 'promotion',
    REQUEST_PAYMENT = 'request-payment',
    MOTIVATION = 'motivation',
    TICKET = 'ticket',
    RECEIPT = 'receipt',
    RULE = 'rules',
    ADVICE = 'advices',
    CUSTOM = 'custom',
}

export interface ITravelList {
    title: string
    items: string[]
    type: 'rules' | 'advices'
    description: string;
}

export interface IExcursionConfigAction {
    type: ExcursionConfigTypeEnum,
    enabled: boolean;
    schedule: Date[];
    title: string;
};

export interface IExcursionMessage {
    type: ExcursionConfigTypeEnum;
    text: string;
    medias?: IMedia[];
}

export interface IExcursionConfiguration {
    messages: IExcursionMessage[],
    actions: IExcursionConfigAction[],
    rules: ITravelList;
    advices: ITravelList;
}
