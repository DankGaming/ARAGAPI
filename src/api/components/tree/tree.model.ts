import { GraphNode } from "../content/graph-node.model";
import { Employee } from "../employee/employee.model";
import { Node } from "../node/node.model";

export class Tree {
    id: number;
    name: string;
    rootNode: GraphNode | number;
    creator: Employee | number;
    publishedTree: number;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}
