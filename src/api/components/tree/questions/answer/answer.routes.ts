import { Router, Request, Response } from "express";
import {
    parseBody,
    parseFilter,
    parseParam,
} from "../../../../../utils/validator/validator";
import * as answerController from "./answer.controller";
import * as nodeController from "../../node/node.controller";
import { isInt } from "../../../../../utils/validator/is-int";
import { CreateAnswerDTO } from "./dto/create-answer.dto";
import { UpdateAnswerDTO } from "./dto/update-answer.dto";
import { onlyConceptTrees } from "../../../../middleware/only-concept-trees";
import { hasTreeAccess } from "../../../../middleware/has-tree-access";
import {
    isAuthenticated,
    mayBeAuthenticated,
} from "../../../../middleware/is-authenticated";
import { Node } from "../../node/node.model";
import { nodeExists } from "../../../../middleware/node-exists";

const router: Router = Router({ mergeParams: true });

router.get(
    "/",
    isAuthenticated,
    onlyConceptTrees,
    async (req: Request, res: Response) => {
        const treeID = +req.params.treeID;
        const questionID = +req.params.questionID;

        const answers: Node[] = await answerController.findAnswersOfQuestion(
            treeID,
            questionID
        );

        res.json({
            success: true,
            result: answers,
        });
    }
);

router.get(
    "/:answerID/linkable",
    mayBeAuthenticated,
    hasTreeAccess,
    async (req: Request, res: Response) => {
        const treeID = +req.params.treeID;
        const answerID = +req.params.answerID;
        const nodes: Partial<Node>[] = await nodeController.findLinkableNodes(treeID, answerID);

        res.json({
            success: true,
            result: nodes,
        });
    }
);

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

router.get(
    "/:answerID",
    mayBeAuthenticated,
    [parseParam("answerID", isInt)],
    nodeExists("answerID"),
    hasTreeAccess,
    async (req: Request, res: Response) => {
        const treeID = +req.params.treeID;
        const answerID = +req.params.answerID;

        const answer: Node = await nodeController.findByID(treeID, answerID);

        res.json({
            success: true,
            result: answer,
        });
    }
);

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

router.delete(
    "/:answerID",
    isAuthenticated,
    [parseParam("answerID", isInt)],
    nodeExists("answerID"),
    onlyConceptTrees,
    async (req: Request, res: Response) => {
        const treeID = +req.params.treeID;
        const answerID = +req.params.answerID;

        await nodeController.remove(treeID, answerID);

        res.json({
            success: true,
        });
    }
);

export default router;
