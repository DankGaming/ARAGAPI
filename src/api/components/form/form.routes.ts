import { Router, Request, Response, NextFunction } from "express";
import * as formController from "./form.controller";
import { Form } from "./form.model";
import { IsInt } from "class-validator";
import {
    parseParam,
    parseBody,
    parseFilter,
} from "../../../utils/validator/validator";
import { isAuthenticated } from "../../middleware/is-authenticated";
import { CreateFormDTO } from "./dto/create-form.dto";
import { UpdateFormDTO } from "./dto/update-form.dto";
import { SubmitFormDTO } from "./dto/submit-form.dto";
import { Filter } from "../../../utils/filter";
import formInputRoutes from "./form-input/form-input.routes";
import { formExists } from "../../middleware/form-exists";

const router: Router = Router();

router.get("/", [parseFilter(Filter)], async (req: Request, res: Response) => {
    const filter = req.filter;
    const forms: Form[] = await formController.findAll(filter);

    res.json({
        success: true,
        result: forms,
    });
});

router.get(
    "/:formID",
    [parseParam("formID", IsInt)],
    formExists,
    async (req: Request, res: Response) => {
        const formID = +req.params.formID;
        const form = await formController.findByID(formID);

        res.json({
            success: true,
            result: form,
        });
    }
);

router.post(
    "/",
    [parseBody(CreateFormDTO)],
    isAuthenticated,
    async (req: Request, res: Response) => {
        const dto: CreateFormDTO = req.body;

        const form: Form = await formController.create(dto);

        res.json({
            success: true,
            result: form,
        });
    }
);

router.delete(
    "/:formID",
    [parseParam("formID", IsInt)],
    isAuthenticated,
    formExists,
    async (req: Request, res: Response) => {
        const formID = +req.params.formID;
        await formController.remove(formID);

        res.json({
            success: true,
        });
    }
);

router.patch(
    "/:formID",
    [parseParam("formID", IsInt)],
    isAuthenticated,
    formExists,
    async (req: Request, res: Response) => {
        const formID = +req.params.formID;
        const dto: UpdateFormDTO = req.body;

        const form: Form = await formController.update(formID, dto);

        res.json({
            succes: true,
            result: form,
        });
    }
);

router.post(
    "/:formID/submit",
    [parseParam("formID", IsInt), parseBody(SubmitFormDTO)],
    formExists,
    async (req: Request, res: Response) => {
        const formID = +req.params.formID;
        const dto: SubmitFormDTO = req.body;

        await formController.submit(formID, dto);

        res.json({ success: true });
    }
);

router.use(
    "/:formID/inputs",
    [parseParam("formID", IsInt)],
    formExists,
    formInputRoutes
);

export default router;
