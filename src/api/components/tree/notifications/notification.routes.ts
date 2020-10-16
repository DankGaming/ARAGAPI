import { plainToClass } from "class-transformer";
import { Router, Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../../../exceptions/BadRequestException";
import { parseBody, parseParam } from "../../../../utils/validator/validator";
import { Content } from "../../content/content.model";
import { UpdateContentDTO } from "../../content/dto/update-content.dto";
import { CreateNotificationDTO } from "./dto/create-notification.dto";
import * as notificationController from "./notification.controller";
import { isInt } from "../../../../utils/validator/is-int";

const router: Router = Router({ mergeParams: true });

router.get("/", async (req: Request, res: Response) => {
    const treeID = parseInt(req.params.treeID);
    const content: Content[] = await notificationController.findAllByTree(
        treeID
    );

    res.json({
        success: true,
        result: content,
    });
});

router.post(
    "/",
    [parseBody(CreateNotificationDTO)],
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
    [parseParam("notificationID", isInt)],
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
    [parseBody(UpdateContentDTO), parseParam("notificationID", isInt)],
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.notificationID, 10);
        const updateContentDTO = req.body;

        await notificationController.update(id, updateContentDTO);

        const question: Content = await notificationController.findByID(id);

        res.json({
            success: true,
            result: question,
        });
    }
);

router.delete(
    "/:notificationID",
    [parseParam("notificationID", isInt)],
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.notificationID, 10);
        await notificationController.remove(id);

        res.json({
            success: true,
        });
    }
);

export default router;
