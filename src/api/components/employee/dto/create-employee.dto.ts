import { IsDefined, IsEmail, IsNotEmpty } from "class-validator";

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
}
