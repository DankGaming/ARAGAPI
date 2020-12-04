import { IsOptional } from "class-validator";
import { ContentType } from "../../../node/content-type";
import { CreateNodeDTO } from "../../../node/dto/create-node.dto";

export class CreateAnswerDTO extends CreateNodeDTO {
    readonly type = ContentType.ANSWER;

    @IsOptional()
    next?: number;
}
