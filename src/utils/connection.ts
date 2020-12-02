import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { Employee } from "../api/components/employee/employee.model";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { Tree } from "../api/components/tree/tree.model";
import { QuestionInfo } from "../api/components/tree/questions/question-info/question-info.model";
import { Node } from "../api/components/tree/node/node.model";

createConnection({
    type: "mysql",
    host: "db",
    port: 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [
        // path.join(__dirname, "..", "api", "components", "**", "*", ".model.ts"),
        Employee,
        Node,
        Tree,
        QuestionInfo,
    ],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: true,
    logging: false,
}).then((connection: Connection) => {});
