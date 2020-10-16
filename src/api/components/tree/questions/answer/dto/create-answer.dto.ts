import { IsOptional } from "class-validator";
import { ContentType } from "../../../../content/content.model";
import { CreateContentDTO } from "../../../../content/dto/create-content.dto";

export class CreateAnswerDTO extends CreateContentDTO {
    readonly type = ContentType.ANSWER;

    @IsOptional()
    link?: number;
}
