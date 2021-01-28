import * as treeDAO from "./tree.dao";
import * as nodeDAO from "./node/node.dao";
import * as questionInfoDAO from "./questions/question-info/question-info.dao";
import * as formInfoDAO from "./node/form/form-info/form-info.dao";
import { Tree } from "./tree.model";
import { CreateTreeDTO } from "./dto/create-tree.dto";
import { UpdateTreeDTO } from "./dto/update-tree.dto";
import { Employee, Role } from "../employee/employee.model";
import { FilterTreeDTO } from "./dto/filter-tree.dto";
import { ForbiddenException } from "../../../exceptions/ForbiddenException";
import { NotFoundException } from "../../../exceptions/NotFoundException";
import { DeleteResult } from "typeorm";
import { Node } from "./node/node.model";
import { PreConditionFailedException } from "../../../exceptions/PreConditionFailedException";
import { ContentType } from "./node/content-type";

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
    const tree = await treeDAO.findByID(id);

    if (!tree) throw new NotFoundException("Tree does not exist");

    if (tree.published) await treeDAO.remove(tree.published.id);

    await treeDAO.remove(id);
};

export const update = async (id: number, dto: UpdateTreeDTO): Promise<Tree> => {
    return treeDAO.update(id, dto);
};

export const publish = async (treeID: number): Promise<void> => {
    // Check if the tree has a root node
    const conceptTree = await treeDAO.findByID(treeID);
    if (!conceptTree!.root)
        throw new PreConditionFailedException("Tree does not have a root node");

    const nodes: Node[] = await nodeDAO.findAll(treeID);

    // Make sure all branches end in a notification
    const danglingNodesFilter = (node: Node) =>
        node.children.length === 0 &&
        node.type !== ContentType.NOTIFICATION &&
        node.type !== ContentType.FORM;
    if (nodes.filter(danglingNodesFilter).length > 0)
        throw new PreConditionFailedException(
            "Not all branches end in a notification or a form"
        );

    const publishedVersion = await treeDAO.getPublishedVersion(treeID);

    // Unpublish the tree first if it is already published
    if (publishedVersion?.root) await unpublish(treeID);
    const tree = publishedVersion ?? (await treeDAO.publish(treeID));

    // Copy all nodes and map them to their concept id's
    const map: { [key: number]: Node } = {};
    for (const node of nodes) {
        const publishedNode = await nodeDAO.copy(tree.id, node.id);
        map[node.id] = publishedNode;

        // If the node is a question, copy its info as well
        if (node.questionInfo)
            await questionInfoDAO.copy(node.questionInfo.id, publishedNode.id);
        else if (node.formInfo)
            await formInfoDAO.copy(node.formInfo.id, publishedNode.id);
    }

    // Copy the links between nodes
    for (const node of nodes) {
        const published = map[node.id];
        for (const child of node.children) {
            nodeDAO.link(tree.id, published.id, map[child.id].id);
        }
    }

    // Update the published tree's root node
    const oldTree: Tree = (await treeDAO.findByID(treeID))!;
    const root: Node = map[oldTree.root.id];
    if (root) treeDAO.setRoot(tree.id, root.id);
    treeDAO.update(tree.id, {
        name: oldTree.name,
        description: oldTree.description,
    });
};

export const unpublish = async (treeID: number): Promise<void> => {
    const publishedTree = await treeDAO.getPublishedVersion(treeID);
    if (!publishedTree?.root)
        throw new PreConditionFailedException("Tree is not published");
    return await nodeDAO.deleteAll(publishedTree.id);
};
