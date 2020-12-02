import { IsOptional } from "class-validator";
import { DTO } from "../../../../utils/DTO";

export class UpdateNodeDTO extends DTO {
    @IsOptional()
    parent?: number;

    @IsOptional()
    content?: number;
}
