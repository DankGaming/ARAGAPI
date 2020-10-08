import { Router, Request, Response, NextFunction } from "express";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import { validateOrReject } from "class-validator";
import { plainToClass, Expose } from "class-transformer";
import { NotFoundException } from "../../exceptions/NotFoundException";
import * as employeeController from "./employee.controller";

const router: Router = Router();

const myLogger = function (req: Request, res: Response, next: NextFunction) {
    console.log("LOGGED");
    next();
};

router.post("/", employeeController.createEmployee);

router.get("/:id", employeeController.getEmployee);

export default router;
