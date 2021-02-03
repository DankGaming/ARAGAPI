import { IsNotEmpty, IsNumber } from "class-validator";
import { DTO } from "../../../../../../../utils/DTO";

export class CreateFormInfoDTO extends DTO {
    @IsNotEmpty()
    @IsNumber()
    form: number;
}
