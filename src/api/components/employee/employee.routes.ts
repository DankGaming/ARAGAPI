import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";
import { Router, Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../../exceptions/BadRequestException";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import { UpdateEmployeeDTO } from "./dto/update-employee.dto";
import * as employeeController from "./employee.controller";
import { Employee } from "./employee.model";

const router: Router = Router();

router.get(
    "/",
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Employee[]> => {
        return employeeController.getAll();
    }
);

router.post(
    "/",
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Employee> => {
        const createEmployeeDTO = plainToClass(CreateEmployeeDTO, req.body);

        try {
            await validateOrReject(createEmployeeDTO);
        } catch (errors) {
            next(new BadRequestException(errors[0].constraints));
        }

        return await employeeController.create(createEmployeeDTO);
    }
);

router.get(
    "/:id(\\d+)/",
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Employee> => {
        const id = parseInt(req.params.id, 10);
        if (id == NaN) throw new BadRequestException("Failed to parse ID");
        return await employeeController.findByID(id);
    }
);

router.delete(
    "/:id(\\d+)/",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const id = parseInt(req.params.id, 10);
        if (id == NaN) throw new BadRequestException("Failed to parse ID");
        await employeeController.remove(id);
    }
);

router.patch(
    "/:id(\\d+)/",
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Employee> => {
        const id = parseInt(req.params.id, 10);
        if (id == NaN) throw new BadRequestException("Failed to parse ID");

        const updateEmployeeDTO = plainToClass(UpdateEmployeeDTO, req.body);

        try {
            await validateOrReject(updateEmployeeDTO);
        } catch (errors) {
            next(new BadRequestException(errors[0].constraints));
        }

        return await employeeController.update(id, updateEmployeeDTO);
    }
);

export default router;
