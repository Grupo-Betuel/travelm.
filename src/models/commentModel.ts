import {IMedia} from "./mediaModel";
import IUser from "@/models/interfaces/userModel";

export interface IComments {
    text: string;
    medias?: IMedia[];
    createDate: Date;
    author?: IUser;

}

