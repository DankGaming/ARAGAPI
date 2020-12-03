import { IsOptional } from "class-validator";
import { ContentType } from "../../../content/content.model";
import { CreateContentDTO } from "../../../content/dto/create-content.dto";
import { CreateNodeDTO } from "../../node/dto/create-node.dto";

export class CreateNotificationDTO extends CreateNodeDTO {
    readonly type = ContentType.NOTIFICATION;

    @IsOptional()
    root?: boolean;

    @IsOptional()
    next?: number;
}
