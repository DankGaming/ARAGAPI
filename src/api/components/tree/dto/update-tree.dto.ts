import { IsOptional } from "class-validator";
import { DTO } from "../../../../utils/DTO";

export class UpdateTreeDTO extends DTO {
    @IsOptional()
    name?: string;

    @IsOptional()
    rootNode?: number;
}
