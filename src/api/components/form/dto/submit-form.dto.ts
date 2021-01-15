import { isObject, IsObject } from "class-validator";
import { getRepository } from "typeorm";
import { DTO } from "../../../../utils/DTO";
import { FormInputType } from "../../form-input-type/form-input-type.model";

export class SubmitFormDTO extends DTO {
    @IsObject()
    answers: {
        [question: number]: number;
    };

    @IsObject()
    form: {
        [key: string]: any;
    };
}
