import * as treeDAO from "./tree.dao";
import * as nodeDAO from "../node/node.dao";
import * as contentDAO from "../content/content.dao";
import * as employeeDAO from "../employee/employee.dao";
import { Tree } from "./tree.model";
import { CreateTreeDTO } from "./dto/create-tree.dto";
import { UpdateTreeDTO } from "./dto/update-tree.dto";
import { RowDataPacket } from "mysql2";
import { Node } from "../node/node.model";
import { GraphNode } from "../content/graph-node.model";
import { Content, ContentType } from "../content/content.model";
import { Employee, Role } from "../employee/employee.model";
import { createPrivateKey } from "crypto";

export const findAll = async (employee: Employee): Promise<Tree[]> => {
    let trees: Tree[] = [];
    if (employee) {
        trees = await treeDAO.findAllConcepts();
    } else {
        trees = await treeDAO.findAllPublished();
    }

    return trees;
};

export const findByID = async (id: number): Promise<Tree> => {
    const tree: Tree = await treeDAO.findByID(id);

    const creator: Employee = await employeeDAO.findByID(
        tree.creator as number
    );

    delete creator.password;
    tree.creator = creator;

    return tree;
};

export const findByIDWithContent = async (id: number) => {
    const tree: Tree = await treeDAO.findByID(id);
    const content: GraphNode = await contentDAO.findRecursively(id);
    const creator: Employee = await employeeDAO.findByID(
        tree.creator as number
    );

    delete creator.password;

    tree.rootNode = content;
    tree.creator = creator;

    return tree;
};

export const create = async (createTreeDTO: CreateTreeDTO): Promise<Tree> => {
    const id: number = await treeDAO.create(createTreeDTO);
    const tree: Tree = await treeDAO.findByID(id);

    return tree;
};

export const remove = async (id: number): Promise<void> => {
    await treeDAO.findByID(id);
    await treeDAO.remove(id);
};

export const update = async (
    id: number,
    updateTreeDTO: UpdateTreeDTO
): Promise<void> => {
    await treeDAO.findByID(id);
    await treeDAO.update(id, updateTreeDTO);
};

export const copy = async (
    fromTreeID: number,
    toTreeID: number
): Promise<void> => {
    const graph: GraphNode = await contentDAO.findRecursively(fromTreeID);

    const parentCache: {
        [nodeID: number]: number;
    } = {};

    async function transform(node: GraphNode): Promise<void> {
        const contentID: number = await contentDAO.create(toTreeID, {
            content: node.content,
            type: node.type as ContentType,
        });

        function search(
            haystack: GraphNode,
            needle: GraphNode
        ): GraphNode | undefined {
            return haystack.children.includes(needle)
                ? haystack
                : haystack.children.find((n) => search(n, needle) != undefined);
        }
        const parent = search(graph, node)?.id;

        const nodeID: number = await nodeDAO.create({
            parent: parent == undefined ? undefined : parentCache[parent],
            content: contentID,
        });
        parentCache[node.id] = nodeID;

        console.log(parentCache);

        node.children.forEach(transform);
    }

    await transform(graph);

    // Copy tree metadata
    const fromTree: Tree = await treeDAO.findByID(fromTreeID);
    await treeDAO.update(toTreeID, {
        name: fromTree.name,
        creator: fromTree.creator as number,
        rootNode: parentCache[fromTree.rootNode as number],
    });
};

export const publish = async (conceptTreeID: number): Promise<void> => {
    const conceptTree: Tree = await findByID(conceptTreeID);

    if (!conceptTree.publishedTree) {
        const tree: Tree = await create({
            name: conceptTree.name,
            creator: conceptTree.creator as number,
        });

        await treeDAO.updatePublishedTree(conceptTree.id, tree.id);

        conceptTree.publishedTree = tree.id;
    }

    await treeDAO.publish(conceptTree.publishedTree);
    await contentDAO.removeFromTree(conceptTree.publishedTree);
    await copy(conceptTreeID, conceptTree.publishedTree);
};

export const unpublish = async (conceptTreeID: number): Promise<void> => {
    const conceptTree: Tree = await findByID(conceptTreeID);
    await treeDAO.unpublish(conceptTree.publishedTree);
    await contentDAO.removeFromTree(conceptTree.publishedTree);
};
