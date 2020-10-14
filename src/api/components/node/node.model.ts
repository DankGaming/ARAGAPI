import { Content } from "../content/content.model";

export class Node {
    id: number;
    parent: Node;
    content: Content;
    createdAt: Date;
    updatedAt: Date;
}
