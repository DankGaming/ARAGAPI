import { IsNotEmpty, IsOptional } from "class-validator";
import { DTO } from "../../../../utils/DTO";
import { ContentType } from "../content.model";

export class CreateContentDTO extends DTO {
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    type: ContentType;
}
