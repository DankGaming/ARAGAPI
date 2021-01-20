import { Filter } from "../../../../utils/filter";
import * as formInputDAO from "./form-input.dao";
import { FormInput } from "./form-input.model";
import { CreateFormInputDTO } from "./dto/create-form-input.dto";
import { UpdateFormInputDTO } from "./dto/update-form-input.dto";
import { NotFoundException } from "../../../../exceptions/NotFoundException";

export const findAll = async (
    formID: number,
    filter: Filter
): Promise<FormInput[]> => {
    return formInputDAO.findAll(formID, filter);
};

export const findByID = async (id: number): Promise<FormInput> => {
    const input = await formInputDAO.findByID(id);

    if (!input) throw new NotFoundException("Form input not found");

    return input;
};

export const create = async (
    formID: number,
    dto: CreateFormInputDTO
): Promise<FormInput> => {
    return await formInputDAO.create(formID, dto);
};

export const update = async (
    id: number,
    dto: UpdateFormInputDTO
): Promise<FormInput> => {
    const input = await formInputDAO.findByID(id);

    if (!input) throw new NotFoundException("Form input not found");

    return await formInputDAO.update(id, dto);
};

export const remove = async (id: number): Promise<void> => {
    const input = await formInputDAO.findByID(id);

    if (!input) throw new NotFoundException("Form input not found");

    formInputDAO.remove(id);
};
