import { IsOptional } from "class-validator";
import { UpdateNodeDTO } from "../../../node/dto/update-node.dto";

export class UpdateAnswerDTO extends UpdateNodeDTO {
    @IsOptional()
    next?: number;
}
