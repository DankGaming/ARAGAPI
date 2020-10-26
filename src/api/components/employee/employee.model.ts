import bcrypt from "bcrypt";

export class Employee {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;

    async checkPassword(password: string) {
        return await bcrypt.compare(password, this.password!);
    }
}

export enum Role {
	ADMIN = "ADMIN",
	STANDARD = "STANDARD"
}
