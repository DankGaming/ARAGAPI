import { Type } from "class-transformer";
import {
    IsNotEmpty,
    IsOptional,
    MinLength,
    ValidateNested,
} from "class-validator";
import { CreateAnswerDTO } from "../answer/dto/create-answer.dto";
import "reflect-metadata";
import { CreateNodeDTO } from "../../node/dto/create-node.dto";
import { CreateQuestionInfoDTO } from "../question-info/dto/create-question-info.dto";
import { ContentType } from "../../node/content-type";

export class CreateQuestionDTO extends CreateNodeDTO {
    readonly type = ContentType.QUESTION;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateQuestionInfoDTO)
    info: CreateQuestionInfoDTO;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateAnswerDTO)
    answers: CreateAnswerDTO[];

    @IsOptional()
    root?: boolean;
}
