import { IsOptional } from "class-validator";
import { DTO } from "../../../../utils/DTO";
import { ContentType } from "../content.model";

export class UpdateContentDTO extends DTO {
    @IsOptional()
    content?: string;

    @IsOptional()
    type?: ContentType;
}
