import { IsOptional } from "class-validator";
import { ContentType } from "../../../content/content.model";
import { CreateContentDTO } from "../../../content/dto/create-content.dto";

export class CreateNotificationDTO extends CreateContentDTO {
    readonly type = ContentType.NOTIFICATION;

    @IsOptional()
    root?: boolean;

    @IsOptional()
    link?: number;
}
