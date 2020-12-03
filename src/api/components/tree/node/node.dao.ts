import {
    DeleteQueryBuilder,
    DeleteResult,
    getManager,
    getRepository,
    RelationQueryBuilder,
    Repository,
    SelectQueryBuilder,
    UpdateResult,
} from "typeorm";
import { child } from "winston";
import { NotFoundException } from "../../../../exceptions/NotFoundException";
import { addDefaultFilter } from "../../../../utils/default-filter";
import { Filter } from "../../../../utils/filter";
import { Content, ContentType } from "../../content/content.model";
import { CreateQuestionDTO } from "../questions/dto/create-question.dto";
import { Tree } from "../tree.model";
import { CreateNodeDTO } from "./dto/create-node.dto";
import { FilterNodeDTO } from "./dto/filter-node.dto";
import { UpdateNodeDTO } from "./dto/update-node.dto";
import { Node } from "./node.model";

export interface DirectedAcyclicGraph {
    nodes: {
        [key: number]: Partial<Node>;
    };
    edges: {
        [key: number]: number[];
    };
}

export const getDirectedAcyclicGraph = async (
    treeID: number,
    filter: Filter
): Promise<DirectedAcyclicGraph> => {
    const builder: SelectQueryBuilder<Node> = getRepository(
        Node
    ).createQueryBuilder("node");

    builder.where("node.tree = :treeID", { treeID });

    builder
        .leftJoinAndSelect("node.children", "children")
        .leftJoinAndSelect(
            "node.questionInfo",
            "questionInfo",
            "node.type = :type",
            { type: ContentType.QUESTION }
        );

    addDefaultFilter(builder, filter);

    const nodes: Node[] = await builder.getMany();

    const graph: DirectedAcyclicGraph = {
        nodes: {},
        edges: {},
    };

    for (const node of nodes) {
        let newNode: Partial<Node> = node;
        graph.edges[node.id] = node.children.map((child) => child.id);
        delete newNode.children;
        delete newNode.tree;
        if (!newNode.questionInfo) delete newNode.questionInfo;
        graph.nodes[node.id] = node;
    }

    return graph;
};

export const findAll = async (
    treeID: number,
    filter: FilterNodeDTO
): Promise<Node[]> => {
    const builder: SelectQueryBuilder<Node> = getRepository(
        Node
    ).createQueryBuilder("node");

    builder.where("node.tree = :treeID", { treeID });

    builder
        .leftJoinAndSelect("node.children", "children")
        .leftJoinAndSelect(
            "node.questionInfo",
            "questionInfo",
            "node.type = :type",
            { type: ContentType.QUESTION }
        );

    if (filter.type)
        builder.andWhere("node.type = :type", { type: filter.type });

    addDefaultFilter(builder, filter);

    const nodes: Node[] = await builder.getMany();

    for (const node of nodes) {
        if (!node.questionInfo) delete node.questionInfo;
    }

    return nodes;
};

export const findByID = async (
    treeID: number,
    nodeID: number
): Promise<Node | undefined> => {
    const builder: SelectQueryBuilder<Node> = getRepository(
        Node
    ).createQueryBuilder("node");
    builder
        .where("node.id = :id", { id: nodeID })
        .andWhere("node.tree = :treeID", { treeID });
    builder
        .leftJoinAndSelect(
            "node.questionInfo",
            "questionInfo",
            "node.type = :type",
            { type: ContentType.QUESTION }
        )
        .leftJoinAndSelect("node.children", "children");

    const node = await builder.getOne();

    if (node && !node.questionInfo) delete node.questionInfo;

    return node;
};

export const remove = async (
    treeID: number,
    nodeID: number
): Promise<DeleteResult> => {
    const result: DeleteResult = await getRepository(Node).delete({
        id: nodeID,
        tree: { id: treeID } as Tree,
    });

    return result;
};

export const create = async (
    treeID: number,
    dto: CreateNodeDTO
): Promise<Node> => {
    const node = new Node();
    node.content = dto.content;
    node.type = dto.type;
    node.tree = { id: treeID } as Tree;

    return await getRepository(Node).save(node);
};

export const update = async (
    treeID: number,
    nodeID: number,
    dto: UpdateNodeDTO
): Promise<Node> => {
    const nodeRepository: Repository<Node> = getRepository(Node);

    return nodeRepository.save({
        id: nodeID,
        content: dto.content,
        type: dto.type,
    });
};

export const link = async (
    parentID: number,
    childID: number
): Promise<void> => {
    const nodeRepository: Repository<Node> = getRepository(Node);

    const builder: RelationQueryBuilder<Node> = nodeRepository
        .createQueryBuilder()
        .relation(Node, "children")
        .of(parentID);

    builder.add(childID);
};

export const unlink = async (
    parentID: number,
    childID: number
): Promise<void> => {
    const nodeRepository: Repository<Node> = getRepository(Node);

    const builder: RelationQueryBuilder<Node> = nodeRepository
        .createQueryBuilder()
        .relation(Node, "children")
        .of(parentID);

    builder.remove(childID);
};
