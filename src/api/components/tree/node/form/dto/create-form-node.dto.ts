import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { ContentType } from "../../content-type";
import { CreateNodeDTO } from "../../dto/create-node.dto";
import { CreateFormInfoDTO } from "../form-info/dto/create-form-info.dto";

export class CreateFormNodeDTO extends CreateNodeDTO {
    readonly type = ContentType.FORM;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateFormInfoDTO)
    info: CreateFormInfoDTO;
}
