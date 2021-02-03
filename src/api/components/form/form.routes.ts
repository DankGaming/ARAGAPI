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
import multiParty from "multiparty";
import { BadRequestException } from "../../../exceptions/BadRequestException";
import fs from "fs";
import { InputTypeFactory } from "../form-input-type/types/input-type-factory";

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
    [parseParam("formID", IsInt)],
    formExists,
    async (req: Request, res: Response, next: NextFunction) => {
        const formID = +req.params.formID;

        const form = new multiParty.Form();

        const dto: SubmitFormDTO = {
            answers: {},
            form: {},
            attachments: {},
        };

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(`Error: ${JSON.stringify(err)}`);
                throw new BadRequestException(err.message);
            }

            for (const key of Object.keys(files)) {
                const file = files[key][0];

                const fileInputType = InputTypeFactory.create("FILE");

                if (!fileInputType.parse(file.headers["content-type"]))
                    next(new BadRequestException("File is not supported"));

                if (file.fieldName == "_form") {
                    const buffer: Buffer = fs.readFileSync(file.path);
                    dto.form = JSON.parse(String(buffer));
                } else if (file.fieldName == "_answers") {
                    const buffer: Buffer = fs.readFileSync(file.path);
                    dto.answers = JSON.parse(String(buffer));
                } else {
                    dto.attachments[file.fieldName] = {
                        path: file.path,
                        name: file.originalFilename,
                    };
                }
            }

            try {
                await formController.submit(formID, dto);

                res.json({ success: true });
            } catch (error) {
                next(error);
            }
        });
    }
);

router.use(
    "/:formID/inputs",
    [parseParam("formID", IsInt)],
    formExists,
    formInputRoutes
);

export default router;
