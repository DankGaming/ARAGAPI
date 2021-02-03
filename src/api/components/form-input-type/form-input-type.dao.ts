import { getRepository } from "typeorm";
import { FormInputType } from "./form-input-type.model";

export const findAll = async (): Promise<FormInputType[]> => {
    return getRepository(FormInputType).find();
};
