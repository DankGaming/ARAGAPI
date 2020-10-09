import { NotFoundException } from "../../../exceptions/NotFoundException";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import bcrypt from "bcrypt";
import database from "../../../utils/database";
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { Employee } from "./employee.model";
import { ConflictException } from "../../../exceptions/ConflictException";
import { plainToClass } from "class-transformer";
import { strict } from "assert";
import { UpdateEmployeeDTO } from "./dto/update-employee.dto";
const changeCase = require("change-object-case");

export const getAll = async (): Promise<Employee[]> => {
    const [rows] = await database.execute("SELECT * FROM employee");
    const employees = changeCase.toCamel(rows);
    employees.forEach((employee: Employee) => delete employee.password);
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

const findByEmail = async (email: string): Promise<Employee[]> => {
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
): Promise<Employee> => {
    const { firstname, lastname, email, password } = createEmployeeDTO;

    const employeesWithSameEmail: Employee[] = await findByEmail(email);

    if (employeesWithSameEmail.length > 0)
        throw new ConflictException("Email is already in use");

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result]: [ResultSetHeader, FieldPacket[]] = await database.execute(
        `
        INSERT INTO employee
        (firstname, lastname, email, password)
        VALUES (?, ?, ?, ?)
    `,
        [firstname, lastname, email, hashedPassword]
    );

    return await findByID(result.insertId);
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
): Promise<Employee> => {
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

    const employee = await findByID(id);
    delete employee.password;
    return employee;
};
