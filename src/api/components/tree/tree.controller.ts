import * as treeDAO from "./tree.dao";
import * as contentDAO from "../content/content.dao";
import { Tree } from "./tree.model";
import { CreateTreeDTO } from "./dto/create-tree.dto";
import { UpdateTreeDTO } from "./dto/update-tree.dto";
import { RowDataPacket } from "mysql2";
import { Node } from "../node/node.model";
import { GraphNode } from "../content/graph-node.model";

export const findAll = async (): Promise<Tree[]> => {
    const trees: Tree[] = await treeDAO.findAll();
    return trees;
};

export const findByID = async (id: number): Promise<Tree> => {
    const tree: Tree = await treeDAO.findByID(id);

    return tree;
};

export const findByIDWithContent = async (id: number) => {
    const tree: Tree = await treeDAO.findByID(id);
    const content: GraphNode = await contentDAO.findRecursively(id);

    tree.rootNode = content;

    return tree;
};

// export const findRecursively = async (id: number): Promise<GraphNode> => {
//     const tree = await treeDAO.findRecursively(id);
//     return tree;
// };

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
