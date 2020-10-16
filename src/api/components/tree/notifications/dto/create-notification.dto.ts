import { ContentType } from "../../../content/content.model";
import { CreateContentDTO } from "../../../content/dto/create-content.dto";

export class CreateNotificationDTO extends CreateContentDTO {
    readonly type = ContentType.NOTIFICATION;
}
