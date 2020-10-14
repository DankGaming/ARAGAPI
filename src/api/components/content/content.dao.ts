import { NotFoundException } from "../../../exceptions/NotFoundException";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import bcrypt from "bcrypt";
import database from "../../../utils/database";
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { Employee } from "./employee.model";
import { plainToClass } from "class-transformer";
import { UpdateEmployeeDTO } from "./dto/update-employee.dto";
const changeCase = require("change-object-case");

export const findAll = async (): Promise<Employee[]> => {
    const [rows] = await database.execute("SELECT * FROM employee");
    const employees = changeCase.toCamel(rows);
    return employees;
};
