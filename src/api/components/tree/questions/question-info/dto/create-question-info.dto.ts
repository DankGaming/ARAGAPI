import { IsEnum, IsNotEmpty } from "class-validator";
import { DTO } from "../../../../../../utils/DTO";
import { QuestionType } from "../question-info.model";

export class CreateQuestionInfoDTO extends DTO {
    @IsNotEmpty()
    @IsEnum(QuestionType)
    type: QuestionType;
}
