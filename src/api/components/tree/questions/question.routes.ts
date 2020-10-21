import { plainToClass } from "class-transformer";
import { Router, Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../../../exceptions/BadRequestException";
import { parseBody, parseParam } from "../../../../utils/validator/validator";
import { Content } from "../../content/content.model";
import { UpdateContentDTO } from "../../content/dto/update-content.dto";
import { CreateQuestionDTO } from "./dto/create-question.dto";
import * as questionController from "./question.controller";
import { isInt } from "../../../../utils/validator/is-int";
import { Answer } from "./answer/answer.model";
import { Question } from "./question.model";
import answerRoutes from "./answer/answer.routes";
import { UpdateQuestionDTO } from "./dto/update-question.dto";

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
        const treeID = parseInt(req.params.treeID);

        const question: Question = await questionController.create(
            treeID,
            createQuestionDTO
        );

        res.json({
            success: true,
            result: question,
        });
    }
);

router.get(
    "/:questionID",
    [parseParam("questionID", isInt)],
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.questionID, 10);
        const question: Content = await questionController.findByID(id);

        res.json({
            success: true,
            result: question,
        });
    }
);

router.patch(
    "/:questionID",
    [parseBody(UpdateQuestionDTO), parseParam("questionID", isInt)],
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.questionID, 10);
        const treeID = parseInt(req.params.treeID, 10);
        const updateQuestionDTO = req.body;

        await questionController.update(id, treeID, updateQuestionDTO);

        const question: Content = await questionController.findByID(id);

        res.json({
            success: true,
            result: question,
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

router.use(
    "/:questionID/answers",
    [parseParam("questionID", isInt)],
    answerRoutes
);

export default router;
