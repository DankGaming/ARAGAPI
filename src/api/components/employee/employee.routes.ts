import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";
import { Router, Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../../exceptions/BadRequestException";
import { parseBody, parseParam } from "../../../utils/validator/validator";
import { isInt } from "../../../utils/validator/is-int";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import { UpdateEmployeeDTO } from "./dto/update-employee.dto";
import { UpdatePasswordDTO } from "./dto/update-password.dto";
import * as employeeController from "./employee.controller";
import { Employee, Role } from "./employee.model";
import { hasRole } from "../../middleware/has-role";

const router: Router = Router();

router.get("/", hasRole(Role.ADMIN), async (req: Request, res: Response) => {
    const employees: Employee[] = await employeeController.findAll();

    res.json({
        success: true,
        result: employees,
    });
});

router.post(
    "/",
    [parseBody(CreateEmployeeDTO)],
    async (req: Request, res: Response) => {
        const createEmployeeDTO = req.body;

        const employee: Employee = await employeeController.create(
            createEmployeeDTO
        );

        res.json({
            success: true,
            result: employee,
        });
    }
);

router.get(
    "/:id",
    [parseParam("id", isInt)],
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const employee: Employee = await employeeController.findByID(id);

        res.json({
            success: true,
            result: employee,
        });
    }
);

router.delete(
    "/:id",
    hasRole(Role.ADMIN),
    [parseParam("id", isInt)],
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.id, 10);
        await employeeController.remove(id);

        res.json({
            success: true,
        });
    }
);

router.patch(
    "/:id",
    [parseBody(UpdateEmployeeDTO), parseParam("id", isInt)],
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.id, 10);
        const updateEmployeeDTO = req.body;

        const employee = await employeeController.update(id, updateEmployeeDTO);

        res.json({
            success: true,
            result: employee,
        });
    }
);

router.patch(
    "/:id/password",
    [parseParam("id", isInt)],
    async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);

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
