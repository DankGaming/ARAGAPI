import { plainToClass } from "class-transformer";
import { Router, Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../../../../exceptions/BadRequestException";
import {
    parseBody,
    parseFilter,
    parseParam,
} from "../../../../../utils/validator/validator";
import { Content } from "../../../content/content.model";
import { UpdateContentDTO } from "../../../content/dto/update-content.dto";
import * as answerController from "./answer.controller";
import { isInt } from "../../../../../utils/validator/is-int";
import { CreateAnswerDTO } from "./dto/create-answer.dto";
import { UpdateAnswerDTO } from "./dto/update-answer.dto";
import { onlyConceptTrees } from "../../../../middleware/only-concept-trees";
import { hasTreeAccess } from "../../../../middleware/has-tree-access";
import {
    isAuthenticated,
    mayBeAuthenticated,
} from "../../../../middleware/is-authenticated";
import { FilterNodeDTO } from "../../node/dto/filter-node.dto";
import { Node } from "../../node/node.model";
import { nodeExists } from "../../../../middleware/node-exists";

const router: Router = Router({ mergeParams: true });

router.post(
    "/",
    isAuthenticated,
    [parseBody(CreateAnswerDTO)],
    onlyConceptTrees,
    async (req: Request, res: Response) => {
        const dto = req.body;
        const treeID = +req.params.treeID;
        const questionID = +req.params.questionID;

        const answer: Node = await answerController.create(
            treeID,
            questionID,
            dto
        );

        res.json({
            success: true,
            result: answer,
        });
    }
);

router.patch(
    "/:answerID",
    isAuthenticated,
    [parseBody(UpdateAnswerDTO), parseParam("answerID", isInt)],
    nodeExists("answerID"),
    onlyConceptTrees,
    async (req: Request, res: Response) => {
        const dto = req.body;
        const treeID = +req.params.treeID;
        const answerID = +req.params.answerID;

        await answerController.update(treeID, answerID, dto);

        res.json({
            success: true,
        });
    }
);

// router.get(
//     "/:answerID",
//     mayBeAuthenticated,
//     [parseParam("answerID", isInt)],
//     hasTreeAccess,
//     async (req: Request, res: Response) => {
//         const id = parseInt(req.params.answerID, 10);
//         const answer: Answer = await answerController.findByID(id);

//         res.json({
//             success: true,
//             result: answer,
//         });
//     }
// );

router.patch(
    "/:answerID/unlink",
    isAuthenticated,
    [parseParam("answerID", isInt)],
    nodeExists("answerID"),
    onlyConceptTrees,
    async (req: Request, res: Response) => {
        const treeID = +req.params.treeID;
        const answerID = +req.params.answerID;

        await answerController.unlink(treeID, answerID);

        res.json({
            success: true,
        });
    }
);

export default router;
