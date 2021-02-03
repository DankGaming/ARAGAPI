import * as nodeDAO from "../node.dao";
import * as formInfoDAO from "./form-info/form-info.dao";
import { Node } from "../node.model";
import { FilterNodeDTO } from "../dto/filter-node.dto";
import { ContentType } from "../content-type";
import { CreateFormNodeDTO } from "./dto/create-form-node.dto";

export const findAll = async (
    treeID: number,
    filter: FilterNodeDTO
): Promise<Node[]> => {
    filter.type = ContentType.FORM;
    const notifications: Node[] = await nodeDAO.findAll(treeID, filter);
    return notifications;
};

export const create = async (
    treeID: number,
    dto: CreateFormNodeDTO
): Promise<Node> => {
    const node: Node = await nodeDAO.create(treeID, dto);
    await formInfoDAO.create(node.id, dto.info);

    return node;
};
