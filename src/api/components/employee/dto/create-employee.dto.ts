import { IsNotEmpty } from "class-validator";

export class CreateEmployeeDTO {
    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    email: string;
}