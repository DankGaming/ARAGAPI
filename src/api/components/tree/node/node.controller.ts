import { DirectedAcyclicGraph } from "./node.dao";
import * as nodeDAO from "./node.dao";
import { Filter } from "../../../../utils/filter";
import { NotFoundException } from "../../../../exceptions/NotFoundException";
import { Node } from "./node.model";
import { DeleteResult } from "typeorm";
import { FilterNodeDTO } from "./dto/filter-node.dto";
import { ContentType } from "./content-type";
import { FilterAcyclicGraphDTO } from "./dto/filter-acyclic-graph.dto";
import { BadRequestException } from "../../../../exceptions/BadRequestException";

export const getDirectedAcyclicGraph = async (
    treeID: number,
    filter: FilterAcyclicGraphDTO
): Promise<DirectedAcyclicGraph> => {
    if (!filter.start || !filter.end)
        throw new BadRequestException(`${filter.start ? "end" : "start"} must be defined!`);

    const [start, end] = [await nodeDAO.findByID(treeID, filter.start), await nodeDAO.findByID(treeID, filter.start)];
    if (!start || !end)
        throw new NotFoundException(`${start ? "end" : "start"} is not a valid node!`);

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
    return node!;
};

export const remove = async (treeID: number, nodeID: number): Promise<void> => {
    const result: DeleteResult = await nodeDAO.remove(treeID, nodeID);

    if (result.affected === 0)
        throw new NotFoundException("Node does not exist");
};

export const link = async (
    treeID: number,
    parentID: number,
    nextID: number
): Promise<void> => {
    const parent = (await nodeDAO.findByID(treeID, parentID))!;

    /**
     * If node already has a linked node, delete it and create a new one
     */
    if (parent.children.length !== 0 && parent.type !== ContentType.QUESTION) {
        /**
         * Node has already a linked node, so delete all children (Even though there shouldn't be more than 1 child)
         */
        for (const child of parent.children)
            await nodeDAO.unlink(parentID, child.id);
    }

    await nodeDAO.link(parentID, nextID);
};
