import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { Employee } from "../api/components/employee/employee.model";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { Tree } from "../api/components/tree/tree.model";
import { QuestionInfo } from "../api/components/tree/questions/question-info/question-info.model";
import { Node } from "../api/components/tree/node/node.model";
import { FormInfo } from "../api/components/tree/node/form/form-info/form-info.model";
import { Form } from "../api/components/form/form.model";
import { FormInputType } from "../api/components/form-input-type/form-input-type.model";
import { FormInput } from "../api/components/form/form-input/form-input.model";

createConnection().then((connection: Connection) => {});
