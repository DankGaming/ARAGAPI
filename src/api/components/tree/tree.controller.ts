import * as treeDAO from "./tree.dao";
import { Tree } from "./tree.model";
import { CreateTreeDTO } from "./dto/create-tree.dto";
import { UpdateTreeDTO } from "./dto/update-tree.dto";

export const findAll = async (): Promise<Tree[]> => {
    const trees: Tree[] = await treeDAO.findAll();
    return trees;
};

export const findByID = async (id: number): Promise<Tree> => {
    const tree: Tree = await treeDAO.findByID(id);
    return tree;
};

export const create = async (createTreeDTO: CreateTreeDTO): Promise<Tree> => {
    const id = await treeDAO.create(createTreeDTO);
    const tree: Tree = await treeDAO.findByID(id);
    return tree;
};

export const remove = async (id: number): Promise<void> => {
    await treeDAO.findByID(id);
    return treeDAO.remove(id);
};

export const update = async (
    id: number,
    updateTreeDTO: UpdateTreeDTO
): Promise<Tree> => {
    await treeDAO.findByID(id);
    await treeDAO.update(id, updateTreeDTO);
    const tree: Tree = await treeDAO.findByID(id);
    return tree;
};
