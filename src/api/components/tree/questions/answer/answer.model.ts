import { Content, ContentType } from "../../../content/content.model";

export class Answer extends Content {
    readonly type: ContentType.ANSWER;

    next: {
        id: number | null;
        type: ContentType | null;
    };
}
