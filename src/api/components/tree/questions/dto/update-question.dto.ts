import { IsOptional } from "class-validator";
import { UpdateContentDTO } from "../../../content/dto/update-content.dto";

export class UpdateQuestionDTO extends UpdateContentDTO {
    @IsOptional()
    root?: boolean;
}
