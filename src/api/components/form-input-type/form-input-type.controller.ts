import * as formInputTypeDAO from "./form-input-type.dao";
import { FormInputType } from "./form-input-type.model";

export const findAll = async (): Promise<FormInputType[]> => {
    return await formInputTypeDAO.findAll();
};
