import * as treeDAO from "./tree.dao";
import * as nodeDAO from "./node/node.dao";
import * as questionInfoDAO from "./questions/question-info/question-info.dao";
import { Tree } from "./tree.model";
import { CreateTreeDTO } from "./dto/create-tree.dto";
import { UpdateTreeDTO } from "./dto/update-tree.dto";
import { Employee, Role } from "../employee/employee.model";
import { FilterTreeDTO } from "./dto/filter-tree.dto";
import { ForbiddenException } from "../../../exceptions/ForbiddenException";
import { NotFoundException } from "../../../exceptions/NotFoundException";
import { DeleteResult, EntityManager, getManager } from "typeorm";
import { Node } from "./node/node.model";
import { BadRequestException } from "../../../exceptions/BadRequestException";

export const findAll = async (
    filter: FilterTreeDTO,
    employee: Employee
): Promise<Tree[]> => {
    const isRequestingConceptTrees =
        filter.concept === undefined || filter.concept == true;

    if (!employee && isRequestingConceptTrees)
        throw new ForbiddenException(
            "You should be logged in to access concept trees"
        );

    return treeDAO.findAll(filter);
};

export const findByID = async (id: number): Promise<Tree> => {
    const tree = await treeDAO.findByID(id);

    if (!tree) throw new NotFoundException("Tree does not exist");

    return tree;
};

export const create = async (
    dto: CreateTreeDTO,
    creator: number
): Promise<Tree> => {
    const tree: Tree = await treeDAO.create(dto, creator);

    return tree;
};

export const remove = async (id: number): Promise<void> => {
    const result: DeleteResult = await treeDAO.remove(id);

    if (result.affected === 0)
        throw new NotFoundException("Tree does not exist");
};

export const update = async (id: number, dto: UpdateTreeDTO): Promise<Tree> => {
    return treeDAO.update(id, dto);
};

export const publish = async (treeID: number): Promise<void> => {
    // await getManager().transaction(
    //     async (manager: EntityManager): Promise<void> => {
    const tree =
        (await treeDAO.getPublishedVersion(treeID)) ??
        (await treeDAO.publish(treeID));

    const map: { [key: number]: Node } = {};

    const nodes: Node[] = await nodeDAO.findAll(treeID);
    for (const node of nodes) {
        const publishedNode = await nodeDAO.copy(tree.id, node.id);
        map[node.id] = publishedNode;

        if (node.questionInfo)
            await questionInfoDAO.copy(node.questionInfo.id, publishedNode.id);
    }

    for (const node of nodes) {
        const published = map[node.id];
        for (const child of node.children) {
            nodeDAO.link(published.id, map[child.id].id);
        }
    }

    const oldTree: Tree = (await treeDAO.findByID(treeID))!;
    treeDAO.setRoot(tree.id, map[oldTree.root.id].id);
    //     }
    // );
};

export const unpublish = async (treeID: number): Promise<void> => {
    const publishedTree = await treeDAO.getPublishedVersion(treeID);
    if (!publishedTree) throw new BadRequestException("Tree is not published");
    return await nodeDAO.deleteAll(publishedTree.id);
};
