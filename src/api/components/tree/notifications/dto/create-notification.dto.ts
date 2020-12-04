import { IsOptional } from "class-validator";
import { ContentType } from "../../node/content-type";
import { CreateNodeDTO } from "../../node/dto/create-node.dto";

export class CreateNotificationDTO extends CreateNodeDTO {
    readonly type = ContentType.NOTIFICATION;

    @IsOptional()
    root?: boolean;

    @IsOptional()
    next?: number;
}
