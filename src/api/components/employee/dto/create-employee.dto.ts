import { IsDefined, IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { Role } from "../employee.model";

export class CreateEmployeeDTO {
    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    role: Role = Role.STANDARD;
}
