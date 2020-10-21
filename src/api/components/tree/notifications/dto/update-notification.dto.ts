import { IsOptional } from "class-validator";
import { UpdateContentDTO } from "../../../content/dto/update-content.dto";

export class UpdateNotificationDTO extends UpdateContentDTO {
    @IsOptional()
    link?: number;

    @IsOptional()
    root?: boolean;
}
