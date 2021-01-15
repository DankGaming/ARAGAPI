import { IsNotEmpty, IsNumber } from "class-validator";
import { DTO } from "../../../../../../../utils/DTO";

export class UpdateFormInfoDTO extends DTO {
    @IsNotEmpty()
    @IsNumber()
    form: number;
}
