import { IsOptional } from "class-validator";
import { UpdateContentDTO } from "../../../../content/dto/update-content.dto";
import { UpdateNodeDTO } from "../../../node/dto/update-node.dto";

export class UpdateAnswerDTO extends UpdateNodeDTO {
    @IsOptional()
    next?: number;
}
