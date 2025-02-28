import { Router, Request, Response } from "express";
import {
    parseBody,
    parseFilter,
    parseParam,
} from "../../../../utils/validator/validator";
import { CreateQuestionDTO } from "./dto/create-question.dto";
import * as questionController from "./question.controller";
import * as nodeController from "../node/node.controller";
import { isInt } from "../../../../utils/validator/is-int";
import answerRoutes from "./answer/answer.routes";
import { UpdateQuestionDTO } from "./dto/update-question.dto";
import { onlyConceptTrees } from "../../../middleware/only-concept-trees";
import {
    isAuthenticated,
    mayBeAuthenticated,
} from "../../../middleware/is-authenticated";
import { hasTreeAccess } from "../../../middleware/has-tree-access";
import { Node } from "../node/node.model";
import { FilterNodeDTO } from "../node/dto/filter-node.dto";
import { nodeExists } from "../../../middleware/node-exists";

const router: Router = Router({ mergeParams: true });

router.get(
    "/",
    [parseFilter(FilterNodeDTO)],
    mayBeAuthenticated,
    hasTreeAccess,
    async (req: Request, res: Response) => {
        const treeID = +req.params.treeID;
        const filter = req.filter;
        const nodes: Node[] = await questionController.findAll(treeID, filter);

        res.json({
            success: true,
            result: nodes,
        });
    }
);

router.post(
    "/",
    isAuthenticated,
    [parseBody(CreateQuestionDTO)],
    onlyConceptTrees,
    async (req: Request, res: Response) => {
        const dto = req.body;
        const treeID = +req.params.treeID;

        const question: Node = await questionController.create(treeID, dto);

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
    nodeExists("questionID"),
    hasTreeAccess,
    async (req: Request, res: Response) => {
        const treeID = +req.params.treeID;
        const questionID = +req.params.questionID;

        const question: Node = await nodeController.findByID(
            treeID,
            questionID
        );

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
    nodeExists("questionID"),
    async (req: Request, res: Response) => {
        const treeID = +req.params.treeID;
        const questionID = +req.params.questionID;
        const dto = req.body;

        const question: Node = await questionController.update(
            treeID,
            questionID,
            dto
        );

        res.json({
            success: true,
            result: question,
        });
    }
);

router.use(
    "/:questionID/answers",
    [parseParam("questionID", isInt)],
    nodeExists("questionID"),
    answerRoutes
);

export default router;
