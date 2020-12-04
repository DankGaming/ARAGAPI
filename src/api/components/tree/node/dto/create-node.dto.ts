import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { DTO } from "../../../../../utils/DTO";
import { ContentType } from "../content-type";

export class CreateNodeDTO extends DTO {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsEnum(ContentType)
    type: ContentType;
}
