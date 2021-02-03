import { Router, Request, Response } from "express";
import { Filter } from "../../../../../utils/filter";
import {
    parseBody,
    parseFilter,
} from "../../../../../utils/validator/validator";
import { hasTreeAccess } from "../../../../middleware/has-tree-access";
import {
    isAuthenticated,
    mayBeAuthenticated,
} from "../../../../middleware/is-authenticated";
import { onlyConceptTrees } from "../../../../middleware/only-concept-trees";
import { Node } from "../node.model";
import { CreateFormNodeDTO } from "./dto/create-form-node.dto";
import * as formNodeController from "./form-node.controller";

const router: Router = Router({ mergeParams: true });

router.get(
    "/",
    [parseFilter(Filter)],
    mayBeAuthenticated,
    hasTreeAccess,
    async (req: Request, res: Response) => {
        const treeID = +req.params.treeID;
        const filter = req.filter;
        const nodes: Node[] = await formNodeController.findAll(treeID, filter);

        res.json({
            success: true,
            result: nodes,
        });
    }
);

router.post(
    "/",
    isAuthenticated,
    [parseBody(CreateFormNodeDTO)],
    onlyConceptTrees,
    async (req: Request, res: Response) => {
        const dto = req.body;
        const treeID = +req.params.treeID;

        const node: Node = await formNodeController.create(treeID, dto);

        res.json({
            success: true,
            result: node,
        });
    }
);

export default router;
