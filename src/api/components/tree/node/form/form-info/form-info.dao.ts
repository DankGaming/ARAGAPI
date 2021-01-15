import { getRepository } from "typeorm";
import { Form } from "../../../../form/form.model";
import { Node } from "../../node.model";
import { CreateFormInfoDTO } from "./dto/create-form-info.dto";
import { UpdateFormInfoDTO } from "./dto/update-form-info.dto";
import { FormInfo } from "./form-info.model";

export const findByID = async (
    nodeFormID: number
): Promise<FormInfo | undefined> => {
    return getRepository(FormInfo).findOne(nodeFormID);
};

export const create = async (
    nodeFormID: number,
    dto: CreateFormInfoDTO
): Promise<FormInfo> => {
    const formInfo = new FormInfo();
    formInfo.node = { id: nodeFormID } as Node;
    formInfo.form = { id: dto.form } as Form;

    return getRepository(FormInfo).save(formInfo);
};

export const update = async (
    formInfoID: number,
    dto: UpdateFormInfoDTO
): Promise<FormInfo> => {
    return getRepository(FormInfo).save({
        id: formInfoID,
        form: { id: dto.form } as Form,
    });
};

export const remove = async (formInfoID: number): Promise<void> => {
    getRepository(FormInfo).delete(formInfoID);
};
