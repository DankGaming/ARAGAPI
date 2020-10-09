import * as employeeDAO from "./employee.dao";
import { plainToClass } from "class-transformer";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import { Request, Response, NextFunction } from "express";
import { validateOrReject } from "class-validator";
import { BadRequestException } from "../../../exceptions/BadRequestException";
import { Employee } from "./employee.model";
import { UpdateEmployeeDTO } from "./dto/update-employee.dto";

export const getAll = async (): Promise<Employee[]> => {
    return await employeeDAO.getAll();
};

export const findByID = async (id: number): Promise<Employee> => {
    return await employeeDAO.findByID(id);
};

export const create = async (
    createEmployeeDTO: CreateEmployeeDTO
): Promise<Employee> => {
    return await employeeDAO.create(createEmployeeDTO);
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
