import { plainToClass } from "class-transformer";
import { Router, Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../../../exceptions/BadRequestException";
import { parseBody, parseParam } from "../../../../utils/validator/validator";
import { Content } from "../../content/content.model";
import { UpdateContentDTO } from "../../content/dto/update-content.dto";
import { CreateNotificationDTO } from "./dto/create-notification.dto";
import * as notificationController from "./notification.controller";
import { isInt } from "../../../../utils/validator/is-int";
import { UpdateNotificationDTO } from "./dto/update-notification.dto";
import { onlyConceptTrees } from "../../../middleware/only-concept-trees";
import { hasTreeAccess } from "../../../middleware/has-tree-access";
import {
    isAuthenticated,
    mayBeAuthenticated,
} from "../../../middleware/is-authenticated";

const router: Router = Router({ mergeParams: true });

router.get(
    "/",
    mayBeAuthenticated,
    hasTreeAccess,
    async (req: Request, res: Response) => {
        const treeID = parseInt(req.params.treeID);
        const content: Content[] = await notificationController.findAllByTree(
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
    [parseBody(CreateNotificationDTO)],
    onlyConceptTrees,
    async (req: Request, res: Response) => {
        const createNotificationDTO = req.body;
        const treeID: number = parseInt(req.params.treeID);

        const notification: Content = await notificationController.create(
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
    hasTreeAccess,
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.notificationID, 10);
        const question: Content = await notificationController.findByID(id);

        res.json({
            success: true,
            result: question,
        });
    }
);

router.patch(
    "/:notificationID",
    isAuthenticated,
    [parseBody(UpdateNotificationDTO), parseParam("notificationID", isInt)],
    onlyConceptTrees,
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.notificationID, 10);
        const updateNotificationDTO = req.body;

        await notificationController.update(id, updateNotificationDTO);

        const question: Content = await notificationController.findByID(id);

        res.json({
            success: true,
            result: question,
        });
    }
);

router.patch(
    "/:notificationID/unlink",
    isAuthenticated,
    [parseParam("notificationID", isInt)],
    onlyConceptTrees,
    async (req: Request, res: Response) => {
        const notificationID = parseInt(req.params.notificationID, 10);
        await notificationController.unlink(notificationID);

        res.json({
            success: true,
        });
    }
);

router.delete(
    "/:notificationID",
    isAuthenticated,
    [parseParam("notificationID", isInt)],
    onlyConceptTrees,
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.notificationID, 10);
        await notificationController.remove(id);

        res.json({
            success: true,
        });
    }
);

export default router;
