import {IClient} from "./clientModel";
import {IComments} from "./commentModel";

export interface IReview {
    client: IClient;
    comments: IComments;
    stars: number;
}
