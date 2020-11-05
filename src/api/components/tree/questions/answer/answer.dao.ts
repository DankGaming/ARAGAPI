import { Content } from "../../../content/content.model";
import database from "../../../../../utils/database";
import { FieldPacket, RowDataPacket } from "mysql2";
import { plainToClass } from "class-transformer";
const changeCase = require("change-object-case");

export const findAllByQuestion = async (
    questionID: number
): Promise<Content[]> => {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await database.execute(
        `
        SELECT
            content.*
        FROM content
        JOIN node ON content.id = node.content
        WHERE node.parent = (
            SELECT id FROM node WHERE content = ?
        )
    `,
        [questionID]
    );

    const answers: Content[] = plainToClass(
        Content,
        changeCase.toCamel(rows) as RowDataPacket[]
    );

    return answers;
};
