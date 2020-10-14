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

export const findByID = async (id: number): Promise<Employee> => {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await database.execute(
        `
        SELECT * FROM employee
        WHERE employee.id = ?
    `,
        [id]
    );

    if (rows.length <= 0)
        throw new NotFoundException("Employee does not exist");

    const employee = plainToClass(Employee, changeCase.toCamel(rows)[0]);
    return employee;
};

export const findByEmail = async (email: string): Promise<Employee[]> => {
    const [result]: [RowDataPacket[], FieldPacket[]] = await database.execute(
        `
        SELECT * FROM employee
        WHERE employee.email = ?
    `,
        [email]
    );

    const employees = changeCase.toCamel(result);
    return employees;
};

export const create = async (
    createEmployeeDTO: CreateEmployeeDTO
): Promise<number> => {
    const { firstname, lastname, email, password } = createEmployeeDTO;

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result]: [ResultSetHeader, FieldPacket[]] = await database.execute(
        `
        INSERT INTO employee
        (firstname, lastname, email, password)
        VALUES (?, ?, ?, ?)
    `,
        [firstname, lastname, email, hashedPassword]
    );

    return result.insertId;
};

export const remove = async (id: number): Promise<void> => {
    await findByID(id);
    await database.execute(
        `
        DELETE FROM employee
        WHERE employee.id = ?
    `,
        [id]
    );
};

export const update = async (
    id: number,
    updateEmployeeDTO: UpdateEmployeeDTO
): Promise<void> => {
    const { firstname, lastname, email } = updateEmployeeDTO;

    if (firstname)
        await database.execute(
            `UPDATE employee SET firstname = ? WHERE id = ?`,
            [firstname, id]
        );

    if (lastname)
        await database.execute(
            `UPDATE employee SET lastname = ? WHERE id = ?`,
            [lastname, id]
        );

    if (email)
        await database.execute(`UPDATE employee SET email = ? WHERE id = ?`, [
            email,
            id,
        ]);
};

export const updatePassword = async (
    id: number,
    newPassword: string
): Promise<void> => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await database.execute(`UPDATE employee SET password = ? WHERE id = ?`, [
        hashedPassword,
        id,
    ]);
};
