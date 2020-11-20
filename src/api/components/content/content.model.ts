import { Node } from "../node/node.model";
import { Tree } from "../tree/tree.model";
import * as nodeDAO from "../node/node.dao";
import { NotFoundException } from "../../../exceptions/NotFoundException";

export class Content {
    id: number;
    content: string;
    type: ContentType;
    tree: number;
    node?: Node;
    createdAt: Date;
    updatedAt: Date;
}

export enum ContentType {
    QUESTION = "QUESTION",
    ANSWER = "ANSWER",
    NOTIFICATION = "NOTIFICATION",
}
