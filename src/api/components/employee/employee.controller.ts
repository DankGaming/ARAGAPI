import { EmployeeService } from "./employee.service";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { plainToClass, Expose } from "class-transformer";
import { CreateEmployeeDTO } from "./dto/create-employee.dto"
import { Router, Request, Response, NextFunction } from "express";

export class EmployeeController {
    private employeeService: EmployeeService = new EmployeeService();

    async getEmployee(req: Request, res: Response, next: NextFunction) {
        const employee = plainToClass(CreateEmployeeDTO, req.body);
        return this.employeeService.getEmployee(1).catch(next);
    };
}

