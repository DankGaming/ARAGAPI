import { Router, Request, Response, NextFunction } from "express";
import { CreateEmployeeDTO } from "./dto/create-employee.dto"
import { validateOrReject } from "class-validator";
import { plainToClass, Expose } from "class-transformer";
import { NotFoundException } from "../../exceptions/NotFoundException";
import * as employeeController from "./employee.controller";

const router: Router = Router()

const myLogger = function (req: Request, res: Response, next: NextFunction) {
    console.log('LOGGED')
    next()
}

router.post("/", myLogger, async (req: Request, res: Response, next: NextFunction) => {
    const employee = plainToClass(CreateEmployeeDTO, req.body);


    // try {
    //     await validateOrReject(employee);
    // } catch(errors) {
    //     console.error("Promise rejected (validation failed). Errors: ", errors);
    //     res.json(errors);
    // }

    // return new NotFoundException(next);
});

// router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
//     employeeController.getEmployee(parseInt(req.params.id)).catch(next);
// })


router.get("/:id", employeeController.getEmployee);

export default router;