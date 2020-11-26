import { NotFoundException } from "../../../exceptions/NotFoundException";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import bcrypt from "bcrypt";
import database from "../../../utils/database";
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { Employee } from "./employee.model";
import { plainToClass } from "class-transformer";
import { UpdateEmployeeDTO } from "./dto/update-employee.dto";
import { InternalServerException } from "../../../exceptions/InternalServerException";

import {
    EntityManager,
    getConnection,
    getManager,
    getRepository,
} from "typeorm";

const changeCase = require("change-object-case");

export const findAll = async (): Promise<Employee[]> => {
    return await getRepository(Employee).find();
};

export const findByID = async (id: number): Promise<Employee> => {
    const employee = await getRepository(Employee).findOne(id);
    if (!employee) throw new NotFoundException("Employee does not exist");
    return employee;
};

export const findByIDWithPassword = async (id: number): Promise<Employee> => {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await database.execute(
        `
        SELECT * FROM employee
        WHERE employee.id = ?
    `,
        [id]
    );

    if (rows.length <= 0)
        throw new NotFoundException("Employee does not exist");

    const employee: Employee = plainToClass(
        Employee,
        changeCase.toCamel(rows)[0]
    );

    return employee;
};

export const findByEmail = async (email: string): Promise<Employee | undefined> => {
    const employee = await getRepository(Employee).findOne({
        email,
    });

    return employee;
};

export const findByEmailWithPassword = async (
    email: string
): Promise<Employee> => {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await database.execute(
        `
            SELECT * FROM employee
            WHERE employee.email = ?
        `,
        [email]
    );

    const employee: Employee = plainToClass(
        Employee,
        changeCase.toCamel(rows) as RowDataPacket[]
    )[0];

    return employee;
};

export const create = async (
    createEmployeeDTO: CreateEmployeeDTO
): Promise<Employee> => {
    const { firstname, lastname, email, role, password } = createEmployeeDTO;

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee: Employee = getRepository(Employee).create({
        firstname,
        lastname,
        email,
        role,
        password: hashedPassword,
    });

    return employee;
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
    const { firstname, lastname, email, role } = updateEmployeeDTO;
    const connection = await database.getConnection();
    try {
        await connection.beginTransaction();

        if (firstname)
            await connection.execute(
                `UPDATE employee SET firstname = ? WHERE id = ?`,
                [firstname, id]
            );

        if (lastname)
            await connection.execute(
                `UPDATE employee SET lastname = ? WHERE id = ?`,
                [lastname, id]
            );

        if (email)
            await connection.execute(
                `UPDATE employee SET email = ? WHERE id = ?`,
                [email, id]
            );

        if (role)
            await connection.execute(
                `UPDATE employee SET role = ? WHERE id = ?`,
                [role, id]
            );

        await connection.commit();
        connection.release();
    } catch (err) {
        await connection.rollback();
        connection.release();
        throw new InternalServerException();
    }
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
