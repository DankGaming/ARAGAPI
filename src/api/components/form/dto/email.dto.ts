import { DTO } from "../../../../utils/DTO";
import { Tree } from "../../tree/tree.model";
import { Form } from "../form.model";

export class EmailDTO extends DTO {
    answers: {
        [question: number]: number;
    };
    form: Form;
    formData: { [key: string]: any };
    date: Date;
}
