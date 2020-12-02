import * as employeeDAO from "./employee.dao";
import { plainToClass } from "class-transformer";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import { Request, Response, NextFunction } from "express";
import { validateOrReject } from "class-validator";
import { BadRequestException } from "../../../exceptions/BadRequestException";
import bcrypt from "bcrypt";
import { Employee } from "./employee.model";
import { UpdateEmployeeDTO } from "./dto/update-employee.dto";
import { UpdatePasswordDTO } from "./dto/update-password.dto";
import { ConflictException } from "../../../exceptions/ConflictException";
import { NotFoundException } from "../../../exceptions/NotFoundException";
import { UpdateResult } from "typeorm";

export const findAll = async (): Promise<Employee[]> => {
    const employees = await employeeDAO.findAll();
    return employees;
};

export const findByID = async (id: number): Promise<Employee> => {
    const employee = await employeeDAO.findByID(id);

    if (!employee) throw new NotFoundException("Employee does not exist");

    return employee;
};

export const create = async (
    createEmployeeDTO: CreateEmployeeDTO
): Promise<Employee> => {
    const employeeWithSameEmail = await employeeDAO.findByEmail(
        createEmployeeDTO.email
    );

    if (employeeWithSameEmail)
        throw new ConflictException("Email is already in use");

    const employee = await employeeDAO.create(createEmployeeDTO);
    return employee;
};

export const remove = async (id: number): Promise<void> => {
    await employeeDAO.remove(id);
};

export const update = async (
    id: number,
    updateEmployeeDTO: UpdateEmployeeDTO
): Promise<Employee> => {
    return await employeeDAO.update(id, updateEmployeeDTO);
};

export const updatePassword = async (
    id: number,
    updatePasswordDTO: UpdatePasswordDTO
): Promise<UpdateResult> => {
    const { oldPassword, newPassword, repeatNewPassword } = updatePasswordDTO;
    const employee = await employeeDAO.findByID(id, true);

    if (!employee) throw new NotFoundException("Employee does not exist");

    const passwordIsCorrect = await employee.checkPassword(oldPassword);

    if (!passwordIsCorrect)
        throw new BadRequestException("Password is not correct");
    if (newPassword !== repeatNewPassword)
        throw new BadRequestException("Passwords don't match");

    return await employeeDAO.updatePassword(id, newPassword);
};
