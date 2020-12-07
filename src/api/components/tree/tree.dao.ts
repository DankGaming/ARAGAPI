import { NotFoundException } from "../../../exceptions/NotFoundException";
import { CreateTreeDTO } from "./dto/create-tree.dto";
import { UpdateTreeDTO } from "./dto/update-tree.dto";
import { Tree } from "./tree.model";

import {
    DeleteResult,
    getRepository,
    Repository,
    SelectQueryBuilder,
} from "typeorm";
import { Employee } from "../employee/employee.model";
import { FilterTreeDTO } from "./dto/filter-tree.dto";
import { addDefaultFilter } from "../../../utils/default-filter";
import { Node } from "./node/node.model";
import { ContentType } from "./node/content-type";

export const findAll = async (filter: FilterTreeDTO): Promise<Tree[]> => {
    const builder: SelectQueryBuilder<Tree> = getRepository(
        Tree
    ).createQueryBuilder("tree");

    builder
        .innerJoinAndSelect("tree.creator", "creator")
        .leftJoin("tree.root", "root");

    if (filter.concept != undefined) {
        if (filter.concept) {
            builder.andWhere("tree.concept IS NULL");
        } else {
            builder
                .andWhere("tree.concept IS NOT NULL")
                .andWhere("tree.published IS NULL")
                .andWhere("tree.root IS NOT NULL");
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
    dto: CreateTreeDTO,
    creator: number
): Promise<Tree> => {
    const { name } = dto;

    const tree = new Tree();
    tree.name = name;
    tree.creator = { id: creator } as Employee;

    return getRepository(Tree).save(tree);
};

export const remove = async (id: number): Promise<DeleteResult> => {
    return getRepository(Tree).delete(id);
};

export const update = async (id: number, dto: UpdateTreeDTO): Promise<Tree> => {
    const { name, root } = dto;

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

export const copy = async (treeID: number): Promise<Tree> => {
    const treeRepository: Repository<Tree> = getRepository(Tree);
    const builder: SelectQueryBuilder<Tree> = treeRepository.createQueryBuilder(
        "tree"
    );
    builder.where("tree.id = :id", { id: treeID });
    builder.innerJoinAndSelect("tree.creator", "creator");

    const tree = await builder.getOne();

    if (!tree) throw new NotFoundException("Tree does not exist");

    let newTree: Partial<Tree> = { ...tree };
    delete newTree.id;

    const savedTree = await treeRepository.save(newTree);

    return savedTree;
};

export const publish = async (treeID: number): Promise<Tree> => {
    const treeRepository: Repository<Tree> = getRepository(Tree);
    const tree = await copy(treeID);

    tree.concept = { id: treeID } as Tree;

    const [conceptTree, publishedTree] = await treeRepository.save([
        {
            id: treeID,
            published: tree,
        },
        tree,
    ]);

    return publishedTree;
};

export const setRoot = async (
    treeID: number,
    nodeID: number
): Promise<void> => {
    await getRepository(Tree).save({
        id: treeID,
        root: { id: nodeID },
    });
};

export const isPublished = async (treeID: number): Promise<boolean> => {
    const tree = await getRepository(Tree).findOne(treeID, {
        relations: ["published"],
    });

    if (!tree) throw new NotFoundException("Tree does not exist");

    return tree.published !== null;
};

export const getPublishedVersion = async (
    treeID: number
): Promise<Tree | undefined> => {
    const tree = await getRepository(Tree).findOne(treeID, {
        relations: ["published", "published.root"],
    });

    return tree?.published;
};

// Rename
// export const setPublishedTree = async (id: number, publishedTreeID: number) => {
//     getRepository(Tree).save({
//         id,
//     });
//     await database.execute(
//         `UPDATE tree SET published_tree = ?, published = true WHERE id = ?`,
//         [publishedTreeID, id]
//     );
// };

// export const publish = async (id: number) => {
//     await database.execute(`UPDATE tree SET published = true WHERE id = ?`, [
//         id,
//     ]);
// };

// export const unpublish = async (id: number) => {
//     await database.execute(`UPDATE tree SET published = false WHERE id = ?`, [
//         id,
//     ]);
// };
