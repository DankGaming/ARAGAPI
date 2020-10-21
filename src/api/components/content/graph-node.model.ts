import { Content } from "../content/content.model";

export class GraphNode {
    children: GraphNode[];
    content: Content;
    id: number;
    parent: number;
}
