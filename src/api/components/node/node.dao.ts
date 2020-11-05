import database from "../../../utils/database";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { plainToClass } from "class-transformer";
import { CreateNodeDTO } from "./dto/create-node.dto";
import { Node } from "./node.model";
import { NotFoundException } from "../../../exceptions/NotFoundException";
import { InternalServerException } from "../../../exceptions/InternalServerException";
import { UpdateNodeDTO } from "./dto/update-node.dto";
import { Exception } from "../../../exceptions/Exception";
const changeCase = require("change-object-case");

export const findByID = async (id: number): Promise<Node> => {
    const [rows]: [
        RowDataPacket[],
        FieldPacket[]
    ] = await database.execute(`SELECT * FROM node WHERE id = ?`, [id]);

    if (rows.length <= 0) throw new NotFoundException("Node does not exist");

    const node: Node = plainToClass(Node, changeCase.toCamel(rows)[0]);

    return node;
};

export const findByContentID = async (contentID: number): Promise<Node> => {
    const [rows]: [
        RowDataPacket[],
        FieldPacket[]
    ] = await database.execute(`SELECT * FROM node WHERE content = ?`, [
        contentID,
    ]);

    if (rows.length <= 0) throw new NotFoundException("Node does not exist");

    const node: Node = plainToClass(Node, changeCase.toCamel(rows)[0]);

    return node;
};

export const findParentByChildID = async (childID: number): Promise<Node> => {
    const [rows]: [
        RowDataPacket[],
        FieldPacket[]
    ] = await database.execute(`SELECT * FROM node WHERE parent = ? LIMIT 1;`, [
        childID,
    ]);

    if (rows.length <= 0) throw new NotFoundException("Node does not exist");

    const node: Node = plainToClass(Node, changeCase.toCamel(rows)[0]);

    return node;
};

export const create = async (createNodeDTO: CreateNodeDTO): Promise<number> => {
    const { parent, content } = createNodeDTO;

    const [result]: [ResultSetHeader, FieldPacket[]] = await database.execute(
        `
        INSERT INTO node (parent, content) VALUES (?, ?)
        `,
        [parent || null, content]
    );

    return result.insertId;
};

export const update = async (
    id: number,
    updateNodeDTO: UpdateNodeDTO
): Promise<void> => {
    const { parent, content } = updateNodeDTO;

    const connection = await database.getConnection();

    try {
        await connection.beginTransaction();

        if (parent)
            await connection.execute(
                `UPDATE node SET parent = ? WHERE id = ?`,
                [parent, id]
            );

        if (content)
            await connection.execute(
                `UPDATE node SET content = ? WHERE id = ?`,
                [content, id]
            );

        await connection.commit();
        connection.release();
    } catch (error) {
        await connection.rollback();
        connection.release();
        throw new InternalServerException();
    }
};

export const remove = async (id: number): Promise<void> => {
    await database.execute(`DELETE node WHERE id = ?`, [id]);
};

export const unlink = async (id: number): Promise<void> => {
    await database.execute(`UPDATE node SET parent = null WHERE id = ?`, [id]);
};
