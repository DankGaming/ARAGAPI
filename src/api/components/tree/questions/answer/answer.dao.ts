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

// WITH RECURSIVE rec (id, parent, content_id, content, type) AS (
//     SELECT node.id, node.parent, content.id, content.content, content.type FROM node
//     JOIN content on node.content = content.id
//     WHERE node.id = (
//         SELECT node.id FROM node
//         JOIN tree ON tree.root_node = node.id
//         WHERE node.parent IS NULL AND tree.id = 1
//     )
//     UNION ALL
//     SELECT n.id, n.parent, c.id, c.content, c.type FROM node n
//     INNER JOIN rec ON n.parent = rec.id
//     JOIN content c on n.content = c.id
// ) SELECT id, parent, content_id, content, type FROM rec;
