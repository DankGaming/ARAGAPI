import { EmployeeService } from "./employee.service";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { plainToClass, Expose } from "class-transformer";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import { Router, Request, Response, NextFunction } from "express";

export const getEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employee = plainToClass(CreateEmployeeDTO, req.body);
        const employeeService = new EmployeeService();
        return await employeeService.getEmployee(1);
    } catch (error) {
        next(error);
    }
}