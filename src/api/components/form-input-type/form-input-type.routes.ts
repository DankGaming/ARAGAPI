import { Router, Request, Response } from "express";
import * as formInputTypeController from "./form-input-type.controller";
import { FormInputType } from "./form-input-type.model";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
    const types: FormInputType[] = await formInputTypeController.findAll();

    res.json({
        success: true,
        result: types,
    });
});

export default router;
