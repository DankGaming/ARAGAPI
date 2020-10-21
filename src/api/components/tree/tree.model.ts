import { GraphNode } from "../content/graph-node.model";
import { Employee } from "../employee/employee.model";
import { Node } from "../node/node.model";

export class Tree {
    id: number;
    name: string;
    rootNode: GraphNode | Node;
    creator: Employee;
    createdAt: Date;
    updatedAt: Date;
}
