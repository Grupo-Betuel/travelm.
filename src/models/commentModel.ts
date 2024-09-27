import {IMedia} from "./mediaModel";
import IUser from "@/models/interfaces/userModel";
import {BaseModel} from "@/models/interfaces/BaseModel";

export interface IComment extends BaseModel {
    text: string;
    medias?: IMedia[];
    createDate: Date;
    author?: IUser;

}

