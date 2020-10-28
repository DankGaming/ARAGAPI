import { plainToClass } from "class-transformer";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { InternalServerException } from "../../../exceptions/InternalServerException";
import { NotFoundException } from "../../../exceptions/NotFoundException";
import database from "../../../utils/database";
import { CreateTreeDTO } from "./dto/create-tree.dto";
import { UpdateTreeDTO } from "./dto/update-tree.dto";
import { Tree } from "./tree.model";

const changeCase = require("change-object-case");

export const findAllConcepts = async (): Promise<Tree[]> => {
    const [rows] = await database.execute(
        "SELECT * FROM tree WHERE published_tree IS NOT NULL"
    );
    const content = changeCase.toCamel(rows);
    return content;
};

export const findAllPublished = async (): Promise<Tree[]> => {
    const [rows] = await database.execute(
        "SELECT * FROM tree WHERE published_tree IS NULL AND published = true"
    );
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
    const connection = await database.getConnection();
    try {
        await connection.beginTransaction();

        if (name)
            await connection.execute(`UPDATE tree SET name = ? WHERE id = ?`, [
                name,
                id,
            ]);

        if (creator)
            await connection.execute(
                `UPDATE tree SET creator = ? WHERE id = ? `,
                [creator, id]
            );

        if (rootNode)
            await connection.execute(
                `UPDATE tree SET root_node = ? WHERE id = ?`,
                [rootNode, id]
            );

        await connection.commit();
    } catch (err) {
        await connection.rollback();
        throw new InternalServerException();
    }

    await connection.release();
};

export const updatePublishedTree = async (
    id: number,
    publishedTreeID: number
) => {
    await database.execute(
        `UPDATE tree SET published_tree = ?, published = true WHERE id = ?`,
        [publishedTreeID, id]
    );
};

export const publish = async (id: number) => {
    await database.execute(`UPDATE tree SET published = true WHERE id = ?`, [
        id,
    ]);
};

export const unpublish = async (id: number) => {
    await database.execute(`UPDATE tree SET published = false WHERE id = ?`, [
        id,
    ]);
};
