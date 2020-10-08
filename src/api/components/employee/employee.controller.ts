import * as employeeService from "./employee.service";
import { NotFoundException } from "../../../exceptions/NotFoundException";
import { plainToClass } from "class-transformer";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import { Router, Request, Response, NextFunction } from "express";
import { validateOrReject } from "class-validator";
import { BadRequestException } from "../../../exceptions/BadRequestException";
import { ClassType } from "class-transformer/ClassTransformer";
import { Employee } from "./employee.model";

export const getEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return await employeeService.getEmployee(1);
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
        return await employeeService.createEmployee(createEmployeeDTO);
    } catch (error) {
        next(error);
    }
};
