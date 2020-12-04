import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { UpdateNodeDTO } from "../../node/dto/update-node.dto";
import { UpdateQuestionInfoDTO } from "../question-info/dto/update-question-info.dto";

export class UpdateQuestionDTO extends UpdateNodeDTO {
    @IsOptional()
    root?: boolean;

    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateQuestionInfoDTO)
    info?: UpdateQuestionInfoDTO;
}
