import { IsNotEmpty } from "class-validator";

export class UpdatePasswordDTO {
    @IsNotEmpty()
    oldPassword: string;

    @IsNotEmpty()
    newPassword: string;

    @IsNotEmpty()
    repeatNewPassword: string;
}
