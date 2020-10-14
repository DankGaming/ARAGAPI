import { Tree } from "../tree/tree.model";

export class Content {
    id: number;
    content: string;
    type: ContentType;
    tree: Tree;
    createdAt: Date;
    updatedAt: Date;
}

export enum ContentType {
    QUESTION = "QUESTION",
    ANSWER = "ANSWER",
    NOTIFICATION = "NOTIFICATION",
}
