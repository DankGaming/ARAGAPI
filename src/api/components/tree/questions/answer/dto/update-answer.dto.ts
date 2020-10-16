import { IsOptional } from "class-validator";
import { UpdateContentDTO } from "../../../../content/dto/update-content.dto";

export class UpdateAnswerDTO extends UpdateContentDTO {
    @IsOptional()
    link?: number;
}
