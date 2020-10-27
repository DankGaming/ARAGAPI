import { plainToClass } from "class-transformer";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { NotFoundException } from "../../../exceptions/NotFoundException";
import database from "../../../utils/database";
import { getConditionals } from "../../../utils/get-conditionals";
import { Content } from "./content.model";
import { CreateContentDTO } from "./dto/create-content.dto";
import { FindAllOptionsDTO } from "./dto/find-all-options.dto";
import { UpdateContentDTO } from "./dto/update-content.dto";
import { GraphNode } from "./graph-node.model";
const changeCase = require("change-object-case");

export const findAll = async (
    findAllOptionsDTO?: FindAllOptionsDTO
): Promise<Content[]> => {
    const conditional = getConditionals(findAllOptionsDTO);
    const [rows]: [RowDataPacket[], FieldPacket[]] = await database.execute(
        `SELECT * FROM content WHERE ${conditional}`
    );

    const content: Content[] = plainToClass(
        Content,
        changeCase.toCamel(rows) as RowDataPacket[]
    );
    return content;
};

export const findByID = async (id: number): Promise<Content> => {
    const [rows]: [
        RowDataPacket[],
        FieldPacket[]
    ] = await database.execute(
        `SELECT content.* FROM content WHERE content.id = ?`,
        [id]
    );

    if (rows.length <= 0) throw new NotFoundException("Content does not exist");

    const content: Content = plainToClass(Content, changeCase.toCamel(rows)[0]);
    return content;
};

export const create = async (
    treeID: number,
    createContentDTO: CreateContentDTO
): Promise<number> => {
    const { content, type } = createContentDTO;
    const [result]: [
        ResultSetHeader,
        FieldPacket[]
    ] = await database.execute(
        `INSERT INTO content (content, type, tree) VALUES (?, ?, ?)`,
        [content, type, treeID]
    );

    return result.insertId;
};

export const remove = async (id: number): Promise<void> => {
    await database.execute("DELETE FROM content WHERE id = ?", [id]);
};

export const removeFromTree = async (id: number): Promise<void> => {
    await database.execute(`DELETE FROM content WHERE tree = ?`, [id]);
};

export const update = async (
    id: number,
    updateContentDTO: UpdateContentDTO
): Promise<void> => {
    const { content, type } = updateContentDTO;

    if (content)
        await database.execute(`UPDATE content SET content = ? WHERE id = ?`, [
            content,
            id,
        ]);

    if (type)
        await database.execute(`UPDATE content SET type = ? WHERE id = ?`, [
            type,
            id,
        ]);
};

export const findRecursively = async (id: number): Promise<GraphNode> => {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await database.execute(
        `
        WITH RECURSIVE rec (id, parent, content_id, content, type) AS (
            SELECT node.id, node.parent, content.id, content.content, content.type FROM node
            JOIN content on node.content = content.id
            WHERE node.id = (
                SELECT node.id FROM node
                JOIN tree ON tree.root_node = node.id
                WHERE node.parent IS NULL AND tree.id = ?
            )
            UNION ALL
            SELECT n.id, n.parent, c.id, c.content, c.type FROM node n
            INNER JOIN rec ON n.parent = rec.id
            JOIN content c on n.content = c.id
        ) SELECT id, parent, content_id, content, type FROM rec;
        `,
        [id]
    );

    const graph: GraphNode = ((data: Array<RowDataPacket>) => {
        let mapped: {
            [node: number]: RowDataPacket;
        } = {};

        for (const node of data) {
            mapped[node.id] = node;
            mapped[node.id].children = [];
        }

        let graph: GraphNode = new GraphNode();
        for (const id in mapped) {
            if (mapped.hasOwnProperty(id)) {
                const element = changeCase.toCamel(mapped[id]);
                element.id = element.contentId;
                delete element.contentId;
                if (element.parent) {
                    const parent = element.parent;
                    delete element.parent;
                    mapped[parent].children.push(element as GraphNode);
                } else {
                    graph = element as GraphNode;
                }
            }
        }

        return graph;
    })(rows);

    return graph;
};
