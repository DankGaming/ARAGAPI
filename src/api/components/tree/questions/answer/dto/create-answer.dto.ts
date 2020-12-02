import { IsOptional } from "class-validator";
import { ContentType } from "../../../../content/content.model";
import { CreateNodeDTO } from "../../../node/dto/create-node.dto";

export class CreateAnswerDTO extends CreateNodeDTO {
    readonly type = ContentType.ANSWER;

    @IsOptional()
    next?: number;
}
