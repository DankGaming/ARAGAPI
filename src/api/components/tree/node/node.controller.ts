import { DirectedAcyclicGraph } from "./node.dao";
import * as nodeDAO from "./node.dao";
import { Filter } from "../../../../utils/filter";
import { NotFoundException } from "../../../../exceptions/NotFoundException";
import { Node } from "./node.model";
import { DeleteResult } from "typeorm";

export const findAll = async (
    treeID: number,
    filter: Filter
): Promise<DirectedAcyclicGraph> => {
    const graph: DirectedAcyclicGraph = await nodeDAO.getDirectedAcyclicGraph(
        treeID,
        filter
    );
    return graph;
};

export const findByID = async (
    treeID: number,
    nodeID: number
): Promise<Node> => {
    const node = await nodeDAO.findByID(treeID, nodeID);

    if (!node) throw new NotFoundException("Node does not exist");

    return node;
};

export const remove = async (treeID: number, nodeID: number): Promise<void> => {
    const result: DeleteResult = await nodeDAO.remove(treeID, nodeID);

    if (result.affected === 0)
        throw new NotFoundException("Node does not exist");
};
