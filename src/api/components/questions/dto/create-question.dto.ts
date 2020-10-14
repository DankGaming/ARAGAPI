import { ContentType } from "../../content/content.model";
import { CreateContentDTO } from "../../content/dto/create-content.dto";

export class CreateQuestionDTO extends CreateContentDTO {
    readonly type = ContentType.QUESTION;
}
