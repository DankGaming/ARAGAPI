import { Router } from "express";
import * as employeeController from "./employee.controller";

const router: Router = Router();

router.get("/", employeeController.getAll);

router.post("/", employeeController.createEmployee);

router.get("/:id", employeeController.getEmployee);

export default router;
