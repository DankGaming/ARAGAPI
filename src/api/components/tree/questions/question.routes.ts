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
import { onlyConceptTrees } from "../../../middleware/only-concept-trees";
import {
    isAuthenticated,
    mayBeAuthenticated,
} from "../../../middleware/is-authenticated";
import { hasTreeAccess } from "../../../middleware/has-tree-access";

const router: Router = Router({ mergeParams: true });

router.get(
    "/",
    mayBeAuthenticated,
    hasTreeAccess,
    async (req: Request, res: Response) => {
        const treeID = parseInt(req.params.treeID);
        const content: Content[] = await questionController.findAllByTree(
            treeID
        );

        res.json({
            success: true,
            result: content,
        });
    }
);

router.post(
    "/",
    isAuthenticated,
    [parseBody(CreateQuestionDTO)],
    onlyConceptTrees,
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
    mayBeAuthenticated,
    [parseParam("questionID", isInt)],
    hasTreeAccess,
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
    isAuthenticated,
    [parseBody(UpdateQuestionDTO), parseParam("questionID", isInt)],
    onlyConceptTrees,
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
    isAuthenticated,
    [parseParam("questionID", isInt)],
    onlyConceptTrees,
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
