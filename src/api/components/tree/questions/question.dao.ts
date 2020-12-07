import { getRepository, SelectQueryBuilder } from "typeorm";
import { ContentType } from "../node/content-type";
import { Node } from "../node/node.model";

export const findAll = async (treeID: number): Promise<Node[]> => {
    const builder: SelectQueryBuilder<Node> = getRepository(
        Node
    ).createQueryBuilder("node");

    builder
        .where("node.type = :type", { type: ContentType.QUESTION })
        .andWhere("node.tree = :treeID", { treeID });

    builder
        .leftJoinAndSelect("node.children", "children")
        .leftJoinAndSelect("node.questionInfo", "questionInfo");

    const nodes: Node[] = await builder.getMany();

    return nodes;
};
