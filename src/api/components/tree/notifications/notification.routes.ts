import { Router, Request, Response, NextFunction } from "express";
import {
    parseBody,
    parseFilter,
    parseParam,
} from "../../../../utils/validator/validator";
import { CreateNotificationDTO } from "./dto/create-notification.dto";
import * as notificationController from "./notification.controller";
import * as nodeController from "../node/node.controller";
import { isInt } from "../../../../utils/validator/is-int";
import { UpdateNotificationDTO } from "./dto/update-notification.dto";
import { onlyConceptTrees } from "../../../middleware/only-concept-trees";
import { hasTreeAccess } from "../../../middleware/has-tree-access";
import {
    isAuthenticated,
    mayBeAuthenticated,
} from "../../../middleware/is-authenticated";
import { FilterNodeDTO } from "../node/dto/filter-node.dto";
import { Node } from "../node/node.model";
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
        const notifications: Node[] = await notificationController.findAll(
            treeID,
            filter
        );

        res.json({
            success: true,
            result: notifications,
        });
    }
);

router.post(
    "/",
    isAuthenticated,
    [parseBody(CreateNotificationDTO)],
    onlyConceptTrees,
    async (req: Request, res: Response) => {
        const createNotificationDTO = req.body;
        const treeID: number = +req.params.treeID;

        const notification: Node = await notificationController.create(
            treeID,
            createNotificationDTO
        );

        res.json({
            success: true,
            result: notification,
        });
    }
);

router.get(
    "/:notificationID",
    mayBeAuthenticated,
    [parseParam("notificationID", isInt)],
    nodeExists("notificationID"),
    hasTreeAccess,
    async (req: Request, res: Response) => {
        const treeID = +req.params.treeID;
        const notificationID = +req.params.notificationID;

        const notification: Node = await nodeController.findByID(
            treeID,
            notificationID
        );

        res.json({
            success: true,
            result: notification,
        });
    }
);

router.patch(
    "/:notificationID",
    isAuthenticated,
    [parseBody(UpdateNotificationDTO), parseParam("notificationID", isInt)],
    onlyConceptTrees,
    async (req: Request, res: Response) => {
        const treeID = +req.params.treeID;
        const notificationID = +req.params.notificationID;
        const updateNotificationDTO = req.body;

        const notification = await notificationController.update(
            treeID,
            notificationID,
            updateNotificationDTO
        );

        res.json({
            result: notification,
            success: true
        });
    }
);

router.patch(
    "/:notificationID/unlink",
    isAuthenticated,
    [parseParam("notificationID", isInt)],
    nodeExists("notificationID"),
    onlyConceptTrees,
    async (req: Request, res: Response) => {
        const treeID = +req.params.treeID;
        const notificationID = +req.params.notificationID;

        await notificationController.unlink(treeID, notificationID);

        res.json({
            success: true,
        });
    }
);

router.delete(
    "/:notificationID",
    isAuthenticated,
    [parseParam("notificationID", isInt)],
    nodeExists("notificationID"),
    onlyConceptTrees,
    async (req: Request, res: Response) => {
        const treeID = +req.params.treeID;
        const notificationID = +req.params.notificationID;
        await nodeController.remove(treeID, notificationID);

        res.json({
            success: true,
        });
    }
);

export default router;
