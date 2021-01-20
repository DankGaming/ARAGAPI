import { IsInt } from "class-validator";
import { Router, Request, Response } from "express";
import { Filter } from "../../../../utils/filter";
import {
    parseBody,
    parseFilter,
    parseParam,
} from "../../../../utils/validator/validator";
import { isAuthenticated } from "../../../middleware/is-authenticated";
import { CreateFormInputDTO } from "./dto/create-form-input.dto";
import { UpdateFormInputDTO } from "./dto/update-form-input.dto";
import * as formInputController from "./form-input.controller";
import { FormInput } from "./form-input.model";

const router: Router = Router({ mergeParams: true });

router.get("/", [parseFilter(Filter)], async (req: Request, res: Response) => {
    const formID = +req.params.formID;
    const filter = req.filter;
    const inputs: FormInput[] = await formInputController.findAll(
        formID,
        filter
    );

    res.json({
        success: true,
        result: inputs,
    });
});

router.get(
    "/:formInputID",
    [parseParam("formInputID", IsInt)],
    async (req: Request, res: Response) => {
        const formInputID = +req.params.formInputID;

        const input: FormInput = await formInputController.findByID(
            formInputID
        );

        res.json({
            success: true,
            result: input,
        });
    }
);

router.post(
    "/",
    isAuthenticated,
    parseBody(CreateFormInputDTO),
    async (req: Request, res: Response): Promise<void> => {
        const dto: CreateFormInputDTO = req.body;
        const formID = +req.params.formID;

        const input: FormInput = await formInputController.create(formID, dto);

        res.json({
            success: true,
            result: input,
        });
    }
);

router.patch(
    "/:formInputID",
    isAuthenticated,
    [parseParam("formInputID", IsInt)],
    async (req: Request, res: Response): Promise<void> => {
        const formInputID = +req.params.formInputID;
        const dto: UpdateFormInputDTO = req.body;

        const input: FormInput = await formInputController.update(
            formInputID,
            dto
        );

        res.json({
            success: true,
            result: input,
        });
    }
);

router.delete(
    "/:formInputID",
    isAuthenticated,
    [parseParam("formInputID", IsInt)],
    async (req: Request, res: Response): Promise<void> => {
        const formInputID = +req.params.formInputID;

        await formInputController.remove(formInputID);

        res.json({
            success: true,
        });
    }
);

export default router;
