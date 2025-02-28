import { IsOptional } from "class-validator";
import { DTO } from "../../../../utils/DTO";

export class UpdateTreeDTO extends DTO {
    @IsOptional()
    name?: string;

    @IsOptional()
    root?: number;

    @IsOptional()
    description?: string;
}
