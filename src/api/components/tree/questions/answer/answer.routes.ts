import { plainToClass } from "class-transformer";
import { Router, Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../../../../exceptions/BadRequestException";
import {
    parseBody,
    parseParam,
} from "../../../../../utils/validator/validator";
import { Content } from "../../../content/content.model";
import { UpdateContentDTO } from "../../../content/dto/update-content.dto";
import * as answerController from "./answer.controller";
import { isInt } from "../../../../../utils/validator/is-int";
import { Answer } from "./answer.model";
import { CreateAnswerDTO } from "./dto/create-answer.dto";
import { UpdateAnswerDTO } from "./dto/update-answer.dto";

const router: Router = Router({ mergeParams: true });

router.get("/", async (req: Request, res: Response) => {
    const questionID = parseInt(req.params.questionID);
    const answers: Content[] = await answerController.findAllByQuestion(
        questionID
    );

    res.json({
        success: true,
        result: answers,
    });
});

router.post(
    "/",
    [parseBody(CreateAnswerDTO)],
    async (req: Request, res: Response) => {
        const createAnswerDTO = req.body;
        const questionID = parseInt(req.params.questionID);
        const treeID = parseInt(req.params.treeID);

        const answer: Content = await answerController.create(
            treeID,
            questionID,
            createAnswerDTO
        );

        res.json({
            success: true,
            result: answer,
        });
    }
);

router.get(
    "/:answerID",
    [parseParam("answerID", isInt)],
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.answerID, 10);
        const answer: Content = await answerController.findByID(id);

        res.json({
            success: true,
            result: answer,
        });
    }
);

router.delete(
    "/:answerID",
    [parseParam("answerID", isInt)],
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.answerID, 10);
        await answerController.remove(id);

        res.json({
            success: true,
        });
    }
);

router.patch(
    "/:answerID",
    [parseBody(UpdateAnswerDTO), parseParam("answerID", isInt)],
    async (req: Request, res: Response) => {
        const updateAnswerDTO = req.body;
        const answerID = parseInt(req.params.answerID, 10);
        const questionID = parseInt(req.params.questionID, 10);
        await answerController.update(questionID, answerID, updateAnswerDTO);

        res.json({
            success: true,
        });
    }
);

export default router;
