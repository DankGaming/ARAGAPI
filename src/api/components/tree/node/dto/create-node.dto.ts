import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { DTO } from "../../../../../utils/DTO";
import { ContentType } from "../../../content/content.model";

export class CreateNodeDTO extends DTO {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsEnum(ContentType)
    type: ContentType;
}
