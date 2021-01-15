import { getRepository, SelectQueryBuilder } from "typeorm";
import { addDefaultFilter } from "../../../../utils/default-filter";
import { Filter } from "../../../../utils/filter";
import { CreateFormInputDTO } from "./dto/create-form-input.dto";
import { UpdateFormInputDTO } from "./dto/update-form-input.dto";
import { FormInput } from "./form-input.model";

export const findAll = async (
    formID: number,
    filter: Filter
): Promise<FormInput[]> => {
    const builder: SelectQueryBuilder<FormInput> = getRepository(
        FormInput
    ).createQueryBuilder("formInput");

    builder.andWhere("formInput.form = :form", { form: formID });

    builder.innerJoinAndSelect("formInput.type", "type");

    addDefaultFilter(builder, filter);
    return builder.getMany();
};

export const findByID = async (
    inputID: number
): Promise<FormInput | undefined> => {
    return getRepository(FormInput).findOne(inputID, {
        relations: ["type"],
    });
};

export const create = async (dto: CreateFormInputDTO): Promise<FormInput> => {
    const formInput = new FormInput();
    formInput.name = dto.name;
    formInput.description = dto.description;

    return getRepository(FormInput).save(formInput);
};

export const update = async (
    inputID: number,
    dto: UpdateFormInputDTO
): Promise<FormInput> => {
    return getRepository(FormInput).save({
        id: inputID,
        name: dto.name,
        description: dto.description,
    });
};

export const remove = async (inputID: number): Promise<void> => {
    getRepository(FormInput).delete(inputID);
};
