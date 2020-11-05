import { IsNotEmpty } from "class-validator";
import { DTO } from "../../../../utils/DTO";

export class CreateNodeDTO extends DTO {
    parent?: number;

    @IsNotEmpty()
    content: number;
}
