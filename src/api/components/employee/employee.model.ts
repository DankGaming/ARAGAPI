import * as controller from "./employee.controller";

export class Employee {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}
