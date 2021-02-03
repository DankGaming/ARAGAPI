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
    if (filter.start) {
        const start = await nodeDAO.findByID(treeID, filter.start);
        if (!start)
            throw new NotFoundException(`start is not a valid node!`);
    }

    const graph: DirectedAcyclicGraph = await nodeDAO.getDirectedAcyclicGraph(
        treeID,
        filter
    );
    return graph;
};

export const findLinkableNodes = async (treeID: number, parentID: number): Promise<Partial<Node>[]> => {
    const graph = await nodeDAO.getDirectedAcyclicGraph(treeID, {});

    const parents: {[key: number]: number[]} = {};
    for (const parent in graph.edges) {
        for (const child of graph.edges[parent]) {
            if (parents[+child] == null) parents[+child] = [];
            parents[+child].push(+parent);
        }
    }

    const valid: number[] = Object.values(graph.nodes).map(n => n.id!);
    const visited: number[] = [];

    const traverse = (node: number): void => {
        visited.push(node);
        valid.splice(valid.indexOf(node), 1);
        
        if (!parents[node]) return;
        for (const parent of parents[node]) {
            if (!visited.includes(parent)) {
                traverse(graph.nodes[parent].id!)
            }
        }
    }

    traverse(parentID);
    return valid.map(n => graph.nodes[n!]).filter(n => n.type != ContentType.ANSWER);
}

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

    await nodeDAO.link(treeID, parentID, nextID);
};
