import { Router, Request, Response, NextFunction } from "express";
import { CreateTreeDTO } from "./dto/create-tree.dto";
import * as treeController from "./tree.controller";
import questionRouter from "./questions/question.routes";
import { UpdateTreeDTO } from "./dto/update-tree.dto";
import nodesRoutes from "./node/node.routes";
import {
    parseBody,
    parseFilter,
    parseParam,
} from "../../../utils/validator/validator";
import { isInt } from "../../../utils/validator/is-int";
import { Tree } from "./tree.model";
import notificationRoutes from "./notifications/notification.routes";
import { onlyConceptTrees } from "../../middleware/only-concept-trees";
import { hasTreeAccess } from "../../middleware/has-tree-access";
import {
    authenticate,
    isAuthenticated,
    mayBeAuthenticated,
} from "../../middleware/is-authenticated";
import { FilterTreeDTO } from "./dto/filter-tree.dto";
import { treeExists } from "../../middleware/tree-exists";

const router: Router = Router();

router.get(
    "/",
    [parseFilter(FilterTreeDTO)],
    mayBeAuthenticated,
    async (req: Request, res: Response) => {
        const filter = req.filter;

        const trees: Tree[] = await treeController.findAll(
            filter,
            req.employee
        );

        res.json({
            success: true,
            result: trees,
        });
    }
);

router.get(
    "/:treeID",
    mayBeAuthenticated,
    [parseParam("treeID", isInt)],
    hasTreeAccess,
    async (req: Request, res: Response) => {
        const id = +req.params.treeID;
        const tree = await treeController.findByID(id);

        res.json({
            success: true,
            result: tree,
        });
    }
);

// router.post(
//     "/",
//     isAuthenticated,
//     [parseBody(CreateTreeDTO)],
//     async (req: Request, res: Response) => {
//         const createTreeDTO = req.body;
//         const creator: number = req.employee.id;

//         const tree: Tree = await treeController.create(createTreeDTO, creator);

//         res.json({
//             success: true,
//             result: tree,
//         });
//     }
// );

// router.patch(
//     "/:treeID",
//     isAuthenticated,
//     [parseBody(UpdateTreeDTO), parseParam("treeID", isInt)],
//     onlyConceptTrees,
//     async (req: Request, res: Response) => {
//         const id = parseInt(req.params.treeID, 10);
//         const updateTreeDTO = req.body;

//         const tree: Tree = await treeController.update(id, updateTreeDTO);

//         res.json({
//             success: true,
//             result: tree,
//         });
//     }
// );

// router.delete(
//     "/:treeID",
//     isAuthenticated,
//     [parseParam("treeID", isInt)],
//     onlyConceptTrees,
//     async (req: Request, res: Response) => {
//         const id = parseInt(req.params.treeID, 10);
//         await treeController.remove(id);

//         res.json({ success: true });
//     }
// );

// router.post(
//     "/:treeID/publish",
//     isAuthenticated,
//     [parseParam("treeID", isInt)],
//     onlyConceptTrees,
//     async (req: Request, res: Response) => {
//         const id: number = parseInt(req.params.treeID);
//         await treeController.publish(id);

//         res.json({ success: true });
//     }
// );

// router.post(
//     "/:treeID/unpublish",
//     isAuthenticated,
//     [parseParam("treeID", isInt)],
//     onlyConceptTrees,
//     async (req: Request, res: Response) => {
//         const id: number = parseInt(req.params.treeID);
//         await treeController.unpublish(id);

//         res.json({ success: true });
//     }
// );

router.use(
    "/:treeID/questions",
    [parseParam("treeID", isInt)],
    treeExists,
    questionRouter
);

router.use(
    "/:treeID/notifications",
    [parseParam("treeID", isInt)],
    notificationRoutes
);

router.use(
    "/:treeID/nodes",
    [parseParam("treeID", isInt)],
    treeExists,
    nodesRoutes
);

export default router;
