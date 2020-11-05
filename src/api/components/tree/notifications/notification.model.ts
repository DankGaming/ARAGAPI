import { Content, ContentType } from "../../content/content.model";

export class Notification extends Content {
    readonly type = ContentType.NOTIFICATION;

    next: {
        id: number | null;
        type: ContentType | null;
    };
}
