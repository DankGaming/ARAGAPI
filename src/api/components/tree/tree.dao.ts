import { plainToClass } from "class-transformer";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { NotFoundException } from "../../../exceptions/NotFoundException";
import database from "../../../utils/database";
import { CreateTreeDTO } from "./dto/create-tree.dto";
import { UpdateTreeDTO } from "./dto/update-tree.dto";
import { Tree } from "./tree.model";
import { GraphNode } from "../node/graphnode.model";

const changeCase = require("change-object-case");

export const findAll = async (): Promise<Tree[]> => {
    const [rows] = await database.execute("SELECT * FROM tree");
    const content = changeCase.toCamel(rows);
    return content;
};

export const findByID = async (id: number): Promise<Tree> => {
    const [rows]: [
        RowDataPacket[],
        FieldPacket[]
    ] = await database.execute(`SELECT * FROM tree WHERE tree.id = ?`, [id]);

    if (rows.length <= 0) throw new NotFoundException("Tree does not exist");

    const content = plainToClass(Tree, changeCase.toCamel(rows)[0]);
    return content;
};

export const findRecursively = async (id: number): Promise<GraphNode> => {
    return {} as GraphNode;
};

/*export const findRecursively = async (id: number): Promise<GraphNode> => {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await database.execute(
        `
        WITH RECURSIVE rec (id, type, parent, content) AS (
            SELECT id, type, parent, content FROM nodes
            WHERE id = (
                SELECT nodes.id FROM nodes
                JOIN trees ON trees.root = nodes.id
                WHERE nodes.parent IS NULL AND trees.id = 1
            )
            UNION ALL
            SELECT n.id, n.type, n.parent, n.content FROM nodes n
            INNER JOIN rec ON n.parent = rec.id
        ) SELECT id, type, content FROM rec;
        `,
        [id]
    );

    console.log(rows);
};*/

export const create = async (createTreeDTO: CreateTreeDTO): Promise<number> => {
    const { name, creator } = createTreeDTO;
    const [result]: [
        ResultSetHeader,
        FieldPacket[]
    ] = await database.execute(
        `INSERT INTO tree (name, creator) VALUES (?, ?)`,
        [name, creator]
    );

    return result.insertId;
};

export const remove = async (id: number): Promise<void> => {
    await database.execute(
        `
        DELETE FROM tree
        WHERE tree.id = ?
    `,
        [id]
    );
};

export const update = async (
    id: number,
    updateTreeDTO: UpdateTreeDTO
): Promise<void> => {
    const { name, creator, rootNode } = updateTreeDTO;

    if (name)
        await database.execute(`UPDATE tree SET name = ? WHERE id = ?`, [
            name,
            id,
        ]);

    if (creator)
        await database.execute(`UPDATE tree SET creator = ? WHERE id = ? `, [
            creator,
            id,
        ]);

    if (rootNode)
        await database.execute(`UPDATE tree SET root_node = ? WHERE id = ?`, [
            rootNode,
            id,
        ]);
};
