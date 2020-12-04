import { IsEnum, IsOptional } from "class-validator";
import { DTO } from "../../../../../../utils/DTO";
import { QuestionType } from "../question-info.model";

export class UpdateQuestionInfoDTO extends DTO {
    @IsOptional()
    @IsEnum(QuestionType)
    type?: QuestionType;
}
