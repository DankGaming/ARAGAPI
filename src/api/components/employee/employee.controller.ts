import * as employeeService from "./employee.service";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { plainToClass } from "class-transformer";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import { Router, Request, Response, NextFunction } from "express";
import { validateOrReject } from "class-validator";
import { BadRequestException } from "../../exceptions/BadRequestException";

export const getEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    return await employeeService.getEmployee(1);
};

export const createEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const createEmployeeDTO = plainToClass(CreateEmployeeDTO, req.body);
        await validateOrReject(createEmployeeDTO);
        const employee = await employeeService.createEmployee(
            createEmployeeDTO
        );
        res.json(employee);
    } catch (error) {
        throw new BadRequestException(error);
    }
};
