import { Employee } from "../employee/employee.model";

export class Tree {
    id: number;
    name: string;
    rootNode: Node;
    creator: Employee;
    createdAt: Date;
    updatedAt: Date;
}
