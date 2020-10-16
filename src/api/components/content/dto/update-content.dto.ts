import { IsOptional } from "class-validator";
import { ContentType } from "../content.model";

export class UpdateContentDTO {
    @IsOptional()
    content?: string;

    @IsOptional()
    type?: ContentType;
}
