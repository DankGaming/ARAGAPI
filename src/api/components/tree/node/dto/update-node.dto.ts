import { IsEnum, IsOptional, IsString } from "class-validator";
import { DTO } from "../../../../../utils/DTO";
import { ContentType } from "../../../content/content.model";

export class UpdateNodeDTO extends DTO {
    @IsOptional()
    @IsString()
    content: string;

    @IsOptional()
    @IsEnum(ContentType)
    type: ContentType;
}
