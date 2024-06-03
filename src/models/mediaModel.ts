import {BaseModel} from "./interfaces/BaseModel";

export enum MediaTypeEnum {
    IMAGE = "image",
    VIDEO = "video",
    AUDIO = "audio",
    DOCUMENT = "document",
}

export enum ExtraMediaTypesEnum {
    FLYER = 'flyer',
    LOGO = 'logo',
}

export interface IMedia extends BaseModel {
    type: MediaTypeEnum;
    content: string;
    owner?: string;
    title: string;
    tags?: string[];
}


export interface IMediaFile extends IMedia {
    // @ts-ignore
    file: File;

}