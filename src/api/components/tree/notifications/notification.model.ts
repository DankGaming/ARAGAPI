import { ChildEntity } from "typeorm";
import { Content, ContentType } from "../../content/content.model";

@ChildEntity()
export class Notification extends Content {
    readonly type = ContentType.NOTIFICATION;

    next: {
        id: number | null;
        type: ContentType | null;
    };
}
