import { IsNotEmpty, IsOptional } from "class-validator";
import { ContentType } from "../content.model";

export class CreateContentDTO {
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    type: ContentType;
}
