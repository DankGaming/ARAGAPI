import { Content } from "../content/content.model";

export class GraphNode {
    children: GraphNode[];
    content: string;
    id: number;
    parent: number;
    type: string;
}
