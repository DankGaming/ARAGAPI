import {
    Router,
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from "express";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import { validateOrReject } from "class-validator";
import { plainToClass, Expose } from "class-transformer";
import { NotFoundException } from "../../exceptions/NotFoundException";
import * as employeeController from "./employee.controller";
import { BadRequestException } from "../../exceptions/BadRequestException";

const router: Router = Router();

router.post("/", employeeController.createEmployee);

router.get("/:id", employeeController.getEmployee);

export default router;
