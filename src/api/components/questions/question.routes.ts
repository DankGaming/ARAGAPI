import { plainToClass } from "class-transformer";
import { Router, Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../../exceptions/BadRequestException";
import { parseBody, parseParam } from "../../../utils/validator/validator";
import { Content } from "../content/content.model";
import { UpdateContentDTO } from "../content/dto/update-content.dto";
import { CreateQuestionDTO } from "./dto/create-question.dto";
import * as questionController from "./question.controller";
import { isInt } from "../../../utils/validator/is-int";

const router: Router = Router({ mergeParams: true });

router.get("/", async (req: Request, res: Response) => {
    const treeID = parseInt(req.params.treeID);
    const content: Content[] = await questionController.findAllByTree(treeID);

    res.json({
        success: true,
        result: content,
    });
});

router.post(
    "/",
    [parseBody(CreateQuestionDTO)],
    async (req: Request, res: Response) => {
        const createQuestionDTO = req.body;
        createQuestionDTO.tree = parseInt(req.params.treeID);

        const id: number = await questionController.create(createQuestionDTO);
        const content: Content = await questionController.findByID(id);

        res.json({
            success: true,
            result: content,
        });
    }
);

router.get(
    "/:questionID",
    [parseParam("questionID", isInt)],
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.questionID, 10);
        const question = await questionController.findByID(id);

        res.json({
            success: true,
            result: question,
        });
    }
);

router.patch(
    "/:questionID",
    [parseBody(UpdateContentDTO), parseParam("questionID", isInt)],
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.questionID, 10);
        const updateContentDTO = req.body;

        const tree = await questionController.update(id, updateContentDTO);

        res.json({
            success: true,
            result: tree,
        });
    }
);

router.delete(
    "/:questionID",
    [parseParam("questionID", isInt)],
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.questionID, 10);
        await questionController.remove(id);

        res.json({
            success: true,
        });
    }
);

export default router;
