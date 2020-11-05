import { Type } from "class-transformer";
import { IsOptional, MinLength, ValidateNested } from "class-validator";
import { CreateAnswerDTO } from "../answer/dto/create-answer.dto";
import { ContentType } from "../../../content/content.model";
import { CreateContentDTO } from "../../../content/dto/create-content.dto";
import "reflect-metadata";

export class CreateQuestionDTO extends CreateContentDTO {
    readonly type = ContentType.QUESTION;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateAnswerDTO)
    answers: CreateAnswerDTO[];

    @IsOptional()
    root?: boolean;
}
