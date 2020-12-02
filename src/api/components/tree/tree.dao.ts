import { plainToClass } from "class-transformer";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { InternalServerException } from "../../../exceptions/InternalServerException";
import { NotFoundException } from "../../../exceptions/NotFoundException";
import database from "../../../utils/database";
import { CreateTreeDTO } from "./dto/create-tree.dto";
import { UpdateTreeDTO } from "./dto/update-tree.dto";
import { Tree } from "./tree.model";

import {
    DeleteResult,
    EntityManager,
    getConnection,
    getManager,
    getRepository,
    SelectQueryBuilder,
    UpdateResult,
} from "typeorm";
import { Employee } from "../employee/employee.model";
import { FilterTreeDTO } from "./dto/filter-tree.dto";
import { addDefaultFilter } from "../../../utils/default-filter";
import { ContentType } from "../content/content.model";
import { Node } from "./node/node.model";

export const findAll = async (filter: FilterTreeDTO): Promise<Tree[]> => {
    const builder: SelectQueryBuilder<Tree> = getRepository(
        Tree
    ).createQueryBuilder("tree");

    builder.innerJoinAndSelect("tree.creator", "creator");

    if (filter.concept != undefined) {
        if (filter.concept) {
            builder.andWhere("tree.concept IS NULL");
        } else {
            builder
                .andWhere("tree.concept IS NOT NULL")
                .andWhere("tree.published IS NULL");
        }
    }

    addDefaultFilter(builder, filter);

    return builder.getMany();
};

export const findByID = async (id: number): Promise<Tree | undefined> => {
    const builder: SelectQueryBuilder<Tree> = getRepository(
        Tree
    ).createQueryBuilder("tree");
    builder.where("tree.id = :id", { id });

    builder
        .innerJoinAndSelect("tree.creator", "creator")
        .leftJoinAndSelect("tree.root", "root")
        .leftJoinAndSelect("root.questionInfo", "info", "root.type = :type", {
            type: ContentType.QUESTION,
        })
        .leftJoinAndSelect("root.children", "children");

    return builder.getOne();
};

export const create = async (
    createTreeDTO: CreateTreeDTO,
    creator: number
): Promise<Tree> => {
    const { name } = createTreeDTO;

    const tree = new Tree();
    tree.name = name;
    tree.creator = { id: creator } as Employee;

    return getRepository(Tree).save(tree);
};

export const remove = async (id: number): Promise<DeleteResult> => {
    return getRepository(Tree).delete(id);
};

export const update = async (
    id: number,
    updateTreeDTO: UpdateTreeDTO
): Promise<Tree> => {
    const { name, root } = updateTreeDTO;

    return getRepository(Tree).save({
        id,
        name,
        root: { id: root } as Node,
    });
};

export const isPublishedVersion = async (id: number): Promise<boolean> => {
    const builder: SelectQueryBuilder<Tree> = getRepository(
        Tree
    ).createQueryBuilder("tree");

    builder
        .where("tree.id = :id", { id })
        .andWhere("tree.concept IS NOT NULL")
        .andWhere("tree.published IS NULL");

    const tree = await builder.getOne();

    if (tree) return true;

    return false;
};

// Rename
export const setPublishedTree = async (id: number, publishedTreeID: number) => {
    getRepository(Tree).save({
        id,
    });
    await database.execute(
        `UPDATE tree SET published_tree = ?, published = true WHERE id = ?`,
        [publishedTreeID, id]
    );
};

export const publish = async (id: number) => {
    await database.execute(`UPDATE tree SET published = true WHERE id = ?`, [
        id,
    ]);
};

export const unpublish = async (id: number) => {
    await database.execute(`UPDATE tree SET published = false WHERE id = ?`, [
        id,
    ]);
};
