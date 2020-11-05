import { IsOptional } from "class-validator";
import { DTO } from "../../../../utils/DTO";
import { ContentType } from "../content.model";

export class FindAllOptionsDTO extends DTO {
    @IsOptional()
    tree?: number;

    @IsOptional()
    type?: ContentType;
}
