import bcrypt from "bcrypt";

export class Employee {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;

    async checkPassword(password: string) {
        return await bcrypt.compare(this.password, password);
    }
}
