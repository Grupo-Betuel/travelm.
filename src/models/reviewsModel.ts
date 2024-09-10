import {IClient} from "./clientModel";
import {IComment} from "./commentModel";

export interface IReview {
    client: IClient;
    comments: IComment;
    stars: number;
}
