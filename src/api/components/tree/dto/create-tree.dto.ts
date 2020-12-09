import { IsNotEmpty, IsOptional } from "class-validator";
import { DTO } from "../../../../utils/DTO";

export class CreateTreeDTO extends DTO {
    @IsNotEmpty()
    name: string;

    @IsOptional()
    description: string;
}
