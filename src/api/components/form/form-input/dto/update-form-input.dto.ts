import { IsOptional } from "class-validator";
import { DTO } from "../../../../../utils/DTO";

export class UpdateFormInputDTO extends DTO {
    @IsOptional()
    name?: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    type?: number;
}
