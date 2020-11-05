import { IsEmail, IsNotEmpty } from "class-validator";
import { DTO } from "../../../../utils/DTO";

export class LoginDTO extends DTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
