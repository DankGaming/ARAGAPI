import { Router, Request, Response } from "express";
import { DirectedAcyclicGraph } from "./node.dao";
import * as nodeController from "./node.controller";
import { parseFilter, parseParam } from "../../../../utils/validator/validator";
import { Filter } from "../../../../utils/filter";
import { Node } from "./node.model";
import { DeleteResult } from "typeorm";
import { isInt } from "../../../../utils/validator/is-int";
import { nodeExists } from "../../../middleware/node-exists";
import { FilterAcyclicGraphDTO } from "./dto/filter-acyclic-graph.dto";

const router: Router = Router({ mergeParams: true });

router.get(
    "/",
    [parseFilter(FilterAcyclicGraphDTO)],
    async (req: Request, res: Response) => {
        const treeID = +req.params.treeID;
        const filter = req.filter;

        const graph: DirectedAcyclicGraph = await nodeController.getDirectedAcyclicGraph(
            treeID,
            filter
        );

        res.json({
            success: true,
            result: graph,
        });
    }
);

router.get(
    "/:nodeID",
    [parseParam("nodeID", isInt)],
    nodeExists("nodeID"),
    async (req: Request, res: Response) => {
        const treeID = +req.params.treeID;
        const nodeID = +req.params.nodeID;

        const node: Node = await nodeController.findByID(treeID, nodeID);

        res.json({
            success: true,
            result: node,
        });
    }
);

router.delete(
    "/:nodeID",
    [parseParam("nodeID", isInt)],
    nodeExists("nodeID"),
    async (req: Request, res: Response) => {
        const treeID = +req.params.treeID;
        const nodeID = +req.params.nodeID;

        await nodeController.remove(treeID, nodeID);

        res.json({
            success: true,
        });
    }
);

export default router;
