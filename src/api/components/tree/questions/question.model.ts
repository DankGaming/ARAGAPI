import { Answer } from "./answer/answer.model";
import { Content, ContentType } from "../../content/content.model";

export class Question extends Content {
    readonly type = ContentType.QUESTION;
    answers: Answer[];
}
