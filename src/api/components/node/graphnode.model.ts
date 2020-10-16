import { Content } from "../content/content.model";

export interface GraphNode {
    children: Node[];
    content: Content;
    id: number;
    createdAt: Date;
    updatedAt: Date;
}
