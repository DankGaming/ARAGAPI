import { Form } from "./form.model";
import * as formDAO from "./form.dao";
import { NotFoundException } from "../../../exceptions/NotFoundException";
import { Filter } from "../../../utils/filter";
import { CreateFormDTO } from "./dto/create-form.dto";
import { UpdateFormDTO } from "./dto/update-form.dto";
import { SubmitFormDTO } from "./dto/submit-form.dto";
import { FormInput } from "./form-input/form-input.model";
import { FormInputType } from "../form-input-type/form-input-type.model";
import { InputTypeFactory } from "../form-input-type/types/input-type-factory";
import { BadRequestException } from "../../../exceptions/BadRequestException";

export const findAll = async (filter: Filter): Promise<Form[]> => {
    return await formDAO.findAll(filter);
};

export const findByID = async (formID: number): Promise<Form> => {
    const form = await formDAO.findByID(formID);

    if (!form) throw new NotFoundException("Form does not exist");

    return form;
};

export const create = async (dto: CreateFormDTO): Promise<Form> => {
    return await formDAO.create(dto);
};

export const update = async (
    formID: number,
    dto: UpdateFormDTO
): Promise<Form> => {
    const form = await formDAO.findByID(formID);

    if (!form) throw new NotFoundException("Form does not exist");

    return await formDAO.update(formID, dto);
};

export const remove = async (formID: number): Promise<void> => {
    const form = await formDAO.findByID(formID);

    if (!form) throw new NotFoundException("Form does not exist");

    await formDAO.remove(formID);
};

export const submit = async (
    formID: number,
    dto: SubmitFormDTO
): Promise<void> => {
    const form: Form = (await formDAO.findByID(formID))!;
    const response = parseForm(form, dto);

    // Generate and send email to configurable email address
    console.log(`response: ${JSON.stringify(response)}`);
};

const parseForm = (form: Form, dto: SubmitFormDTO): { [key: string]: any } => {
    const response: { [key: string]: any } = {};

    for (const input of Object.values(form.inputs)) {
        const value = dto.form[input.name];
        if (!input.type) throw new BadRequestException();
        const cls = InputTypeFactory.create(input.type.name);

        try {
            response[input.name] = cls.parse(value);
        } catch (err) {
            throw new BadRequestException();
        }
    }

    return response;
};

const generateEmail = async (): Promise<void> => {};
