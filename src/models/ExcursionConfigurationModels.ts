import {IMedia} from "@/models/mediaModel";
import {IOption} from "@/components/SearchableSelect";

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

export const excursionConfigTypeLabels: { [N in ExcursionConfigTypeEnum]: string } = {
    promotion: 'Promoción',
    'request-payment': 'Solicitud de pago',
    motivation: 'Motivación',
    ticket: 'Boleto',
    receipt: 'Recibo',
    rules: 'Reglas',
    advices: 'Consejos',
    custom: 'Personalizado'
}

export const excursionConfigTypeList: IOption<ExcursionConfigTypeEnum>[] = [
    { value: ExcursionConfigTypeEnum.PROMOTION, label: excursionConfigTypeLabels.promotion },
    { value: ExcursionConfigTypeEnum.REQUEST_PAYMENT, label: excursionConfigTypeLabels["request-payment"] },
    { value: ExcursionConfigTypeEnum.MOTIVATION, label: excursionConfigTypeLabels.motivation },
    { value: ExcursionConfigTypeEnum.TICKET, label: excursionConfigTypeLabels.ticket },
    { value: ExcursionConfigTypeEnum.RECEIPT, label: excursionConfigTypeLabels.receipt },
    { value: ExcursionConfigTypeEnum.RULE, label: excursionConfigTypeLabels.rules },
    { value: ExcursionConfigTypeEnum.ADVICE, label: excursionConfigTypeLabels.advices },
    { value: ExcursionConfigTypeEnum.CUSTOM, label: excursionConfigTypeLabels.custom }
]
