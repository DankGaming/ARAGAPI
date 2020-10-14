import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";
import { Router, Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../../exceptions/BadRequestException";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import { UpdateEmployeeDTO } from "./dto/update-employee.dto";
import { UpdatePasswordDTO } from "./dto/update-password.dto";
import * as employeeController from "./employee.controller";
import { Employee } from "./employee.model";

const router: Router = Router();

const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log("GELOGD");
    next();
};

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const employees = await employeeController.findAll();

    res.json({
        success: true,
        result: employees,
    });
});

router.post(
    "/",
    logger,
    async (req: Request, res: Response, next: NextFunction) => {
        const createEmployeeDTO = plainToClass(CreateEmployeeDTO, req.body);

        try {
            await validateOrReject(createEmployeeDTO);
        } catch (errors) {
            next(new BadRequestException(errors[0].constraints));
        }

        const employee = await employeeController.create(createEmployeeDTO);

        res.json({
            success: true,
            result: employee,
        });
    }
);

router.get(
    "/:id(\\d+)/",
    async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        if (id == NaN) throw new BadRequestException("Failed to parse ID");
        const employee = await employeeController.findByID(id);

        res.json({
            success: true,
            result: employee,
        });
    }
);

router.delete(
    "/:id(\\d+)/",
    async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        if (id == NaN) throw new BadRequestException("Failed to parse ID");
        await employeeController.remove(id);

        res.json({
            success: true,
        });
    }
);

router.patch(
    "/:id(\\d+)/",
    async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        if (id == NaN) throw new BadRequestException("Failed to parse ID");

        const updateEmployeeDTO = plainToClass(UpdateEmployeeDTO, req.body);

        try {
            await validateOrReject(updateEmployeeDTO);
        } catch (errors) {
            next(new BadRequestException(errors[0].constraints));
        }

        const employee = await employeeController.update(id, updateEmployeeDTO);

        res.json({
            success: true,
            result: employee,
        });
    }
);

router.patch(
    "/:id(\\d+)/password",
    async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        if (id == NaN) throw new BadRequestException("Failed to parse ID");

        const updatePasswordDTO = plainToClass(UpdatePasswordDTO, req.body);

        try {
            await validateOrReject(updatePasswordDTO);
        } catch (errors) {
            next(new BadRequestException(errors[0].constraints));
        }

        await employeeController.updatePassword(id, updatePasswordDTO);

        res.json({
            success: true,
        });
    }
);

export default router;
