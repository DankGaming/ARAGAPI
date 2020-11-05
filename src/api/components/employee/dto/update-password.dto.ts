import { IsNotEmpty } from "class-validator";
import { DTO } from "../../../../utils/DTO";

export class UpdatePasswordDTO extends DTO {
    @IsNotEmpty()
    oldPassword: string;

    @IsNotEmpty()
    newPassword: string;

    @IsNotEmpty()
    repeatNewPassword: string;
}
