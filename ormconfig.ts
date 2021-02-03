import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { Employee } from "./src/api/components/employee/employee.model";
import { FormInputType } from "./src/api/components/form-input-type/form-input-type.model";
import { FormInput } from "./src/api/components/form/form-input/form-input.model";
import { Form } from "./src/api/components/form/form.model";
import { FormInfo } from "./src/api/components/tree/node/form/form-info/form-info.model";
import { Node } from "./src/api/components/tree/node/node.model";
import { QuestionInfo } from "./src/api/components/tree/questions/question-info/question-info.model";
import { Tree } from "./src/api/components/tree/tree.model";

module.exports = {
    type: "mysql",
    host: "db",
    port: 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [
        Employee,
        Node,
        Tree,
        QuestionInfo,
        FormInfo,
        Form,
        FormInput,
        FormInputType,
    ],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: true,
    logging: false,
    seeds: ["src/seeds/**/*.ts"],
    factories: ["src/factories/**/*.ts"],
};
