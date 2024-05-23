import {BaseModel} from "./interfaces/BaseModel";

export interface IMedia extends BaseModel {
    type: 'video' | 'image' | 'audio';
    content: string;
    title: string;
    tags?: string[];
}


export interface IMediaFile extends IMedia {
    // @ts-ignore
    file: File;

}