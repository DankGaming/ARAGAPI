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
    DeleteResult,
    EntityManager,
    getConnection,
    getManager,
    getRepository,
    SelectQueryBuilder,
    UpdateResult,
} from "typeorm";

const changeCase = require("change-object-case");

export const findAll = async (): Promise<Employee[]> => {
    return await getRepository(Employee).find();
};

export const findByID = async (
    id: number,
    selectPassword = false
): Promise<Employee | undefined> => {
    const builder: SelectQueryBuilder<Employee> = getRepository(
        Employee
    ).createQueryBuilder("employee");

    builder.where("employee.id = :id", { id });

    if (selectPassword) builder.addSelect("employee.password");

    return builder.getOne();
};

export const findByEmail = async (
    email: string,
    selectPassword = false
): Promise<Employee | undefined> => {
    const builder: SelectQueryBuilder<Employee> = getRepository(
        Employee
    ).createQueryBuilder("employee");

    builder.where("employee.email = :email", { email });

    if (selectPassword) builder.addSelect("employee.password");

    return builder.getOne();
};

export const create = async (
    createEmployeeDTO: CreateEmployeeDTO
): Promise<Employee> => {
    const { firstname, lastname, email, role, password } = createEmployeeDTO;

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = new Employee();
    employee.firstname = firstname;
    employee.lastname = lastname;
    employee.email = email;
    employee.role = role;
    employee.password = hashedPassword;

    await getRepository(Employee).save(employee);

    delete employee.password;

    return employee;
};

export const remove = async (id: number): Promise<DeleteResult> => {
    return getRepository(Employee).delete(id);
};

export const update = async (
    id: number,
    updateEmployeeDTO: UpdateEmployeeDTO
): Promise<Employee> => {
    const { firstname, lastname, email, role } = updateEmployeeDTO;

    return getRepository(Employee).save({
        id,
        firstname,
        lastname,
        email,
        role,
    });
};

export const updatePassword = async (
    id: number,
    newPassword: string
): Promise<UpdateResult> => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return getRepository(Employee).update(id, {
        password: hashedPassword,
    });
};
