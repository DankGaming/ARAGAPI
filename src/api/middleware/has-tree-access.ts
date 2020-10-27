import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../exceptions/BadRequestException";
import { ForbiddenException } from "../../exceptions/ForbiddenException";
import * as treeDAO from "../components/tree/tree.dao";
import { Tree } from "../components/tree/tree.model";

export async function hasTreeAccess(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.employee) {
        const treeID: number = parseInt(req.params.treeID);

        if (!treeID) throw new ForbiddenException();

        const tree: Tree = await treeDAO.findByID(treeID);

        if (tree.publishedTree === null && tree.published) {
            return next();
        }

        return next(new ForbiddenException());
    }

    return next();
}
