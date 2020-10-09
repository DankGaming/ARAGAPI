import * as employeeDAO from "./employee.dao";
import { plainToClass } from "class-transformer";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import { Request, Response, NextFunction } from "express";
import { validateOrReject } from "class-validator";
import { BadRequestException } from "../../../exceptions/BadRequestException";

export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return await employeeDAO.getAll();
    } catch (error) {
        next(error);
    }
};

export const getEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return await employeeDAO.getByID(1);
    } catch (error) {
        next(error);
    }
};

export const createEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const createEmployeeDTO = plainToClass(CreateEmployeeDTO, req.body);
        try {
            await validateOrReject(createEmployeeDTO);
        } catch (errors) {
            return next(new BadRequestException(errors[0].constraints));
        }
        return await employeeDAO.createEmployee(createEmployeeDTO);
    } catch (error) {
        next(error);
    }
};
