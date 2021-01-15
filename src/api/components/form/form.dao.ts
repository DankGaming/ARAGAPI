import { Form } from "./form.model";
import { getRepository, SelectQueryBuilder } from "typeorm";
import { Filter } from "../../../utils/filter";
import { addDefaultFilter } from "../../../utils/default-filter";
import { CreateFormDTO } from "./dto/create-form.dto";
import { UpdateFormDTO } from "./dto/update-form.dto";

export const findAll = async (filter: Filter): Promise<Form[]> => {
    const builder: SelectQueryBuilder<Form> = getRepository(
        Form
    ).createQueryBuilder("form");

    builder
        .leftJoinAndSelect("form.inputs", "inputs")
        .leftJoinAndSelect("inputs.type", "type");

    addDefaultFilter(builder, filter);

    return builder.getMany();
};

export const findByID = async (formID: number): Promise<Form | undefined> => {
    const builder: SelectQueryBuilder<Form> = getRepository(
        Form
    ).createQueryBuilder("form");

    builder.andWhere("form.id = :formID", { formID });

    builder
        .leftJoinAndSelect("form.inputs", "inputs")
        .leftJoinAndSelect("inputs.type", "type");

    return builder.getOne();
};

export const create = async (dto: CreateFormDTO): Promise<Form> => {
    const form = new Form();
    form.name = dto.name;
    form.description = dto.description;

    return getRepository(Form).save(form);
};

export const update = async (
    formID: number,
    dto: UpdateFormDTO
): Promise<Form> => {
    return getRepository(Form).save({
        id: formID,
        name: dto.name,
        description: dto.description,
    });
};

export const remove = async (formID: number): Promise<void> => {
    getRepository(Form).delete(formID);
};
