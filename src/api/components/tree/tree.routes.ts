import { Router, Request, Response, NextFunction } from "express";
import { CreateTreeDTO } from "./dto/create-tree.dto";
import * as treeController from "./tree.controller";
import questionRouter from "./questions/question.routes";
import { UpdateTreeDTO } from "./dto/update-tree.dto";
import { parseBody, parseParam } from "../../../utils/validator/validator";
import { isInt } from "../../../utils/validator/is-int";
import { Tree } from "./tree.model";
import notificationRoutes from "./notifications/notification.routes";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
    const trees: Tree[] = await treeController.findAll();

    res.json({
        success: true,
        result: trees,
    });
});

router.post(
    "/",
    [parseBody(CreateTreeDTO)],
    async (req: Request, res: Response) => {
        const createTreeDTO = req.body;

        const tree: Tree = await treeController.create(createTreeDTO);

        res.json({
            success: true,
            result: tree,
        });
    }
);

router.get(
    "/:id",
    [parseParam("id", isInt)],
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.id, 10);
        const tree = await treeController.findByIDWithContent(id);
        id;
        res.json({
            success: true,
            result: tree,
        });
    }
);

router.patch(
    "/:id",
    [parseBody(UpdateTreeDTO), parseParam("id", isInt)],
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.id, 10);
        const updateTreeDTO = req.body;

        await treeController.update(id, updateTreeDTO);

        const tree: Tree = await treeController.findByID(id);

        res.json({
            success: true,
            result: tree,
        });
    }
);

router.delete(
    "/:id",
    [parseParam("id", isInt)],
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.id, 10);
    }
);

router.use("/:treeID/questions", [parseParam("treeID", isInt)], questionRouter);
router.use(
    "/:treeID/notifications",
    [parseParam("treeID", isInt)],
    notificationRoutes
);

export default router;
