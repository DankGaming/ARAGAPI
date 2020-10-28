import bcrypt from "bcrypt";

export class Employee {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    role: Role;
    createdAt: string;
    updatedAt: string;

    async checkPassword(password: string) {
        console.log(password, this.password);
        return await bcrypt.compare(password, this.password!);
    }
}

export enum Role {
    ADMIN = "ADMIN",
    STANDARD = "STANDARD",
}
