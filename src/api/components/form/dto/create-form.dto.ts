import { IsNotEmpty, IsOptional } from "class-validator";
import { DTO } from "../../../../utils/DTO";

export class CreateFormDTO extends DTO {
    @IsNotEmpty()
    name: string;

    @IsOptional()
    description?: string;
}
