import { Content, ContentType } from "../content/content.model";

export class Question extends Content {
    readonly type = ContentType.QUESTION;
}
