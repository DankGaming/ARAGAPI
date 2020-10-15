import { IsOptional } from "class-validator";
import { ContentType } from "../content.model";

export class FindAllOptionsDTO {
    @IsOptional()
    tree?: number;

    @IsOptional()
    type?: ContentType;
}
