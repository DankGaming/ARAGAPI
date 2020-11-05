import { IsDefined, IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { DTO } from "../../../../utils/DTO";
import { Role } from "../employee.model";

export class CreateEmployeeDTO extends DTO {
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
