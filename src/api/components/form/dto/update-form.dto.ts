import { IsOptional } from "class-validator";
import { DTO } from "../../../../utils/DTO";

export class UpdateFormDTO extends DTO {
    @IsOptional()
    name?: string;

    @IsOptional()
    description?: string;
}
