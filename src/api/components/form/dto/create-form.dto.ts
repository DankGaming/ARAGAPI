import { IsNotEmpty } from "class-validator";
import { DTO } from "../../../../utils/DTO";

export class CreateFormDTO extends DTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;
}
