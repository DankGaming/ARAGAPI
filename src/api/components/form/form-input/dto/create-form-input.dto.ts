import { IsNotEmpty, IsOptional } from "class-validator";
import { DTO } from "../../../../../utils/DTO";

export class CreateFormInputDTO extends DTO {
    @IsNotEmpty()
    name: string;

    @IsOptional()
    description?: string;

    @IsNotEmpty()
    type: number;
}
