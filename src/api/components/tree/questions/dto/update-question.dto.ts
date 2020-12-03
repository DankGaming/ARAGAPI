import { IsOptional } from "class-validator";
import { UpdateNodeDTO } from "../../node/dto/update-node.dto";

export class UpdateQuestionDTO extends UpdateNodeDTO {
    @IsOptional()
    root?: boolean;
}
