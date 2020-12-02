import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../exceptions/BadRequestException";
import { ForbiddenException } from "../../exceptions/ForbiddenException";
import * as treeDAO from "../components/tree/tree.dao";
import { Tree } from "../components/tree/tree.model";

/**
 * Check if the user has access to a tree
 * @param req
 * @param res
 * @param next
 */
export async function hasTreeAccess(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.employee) {
        const treeID: number = +req.params.treeID;

        if (!treeID) throw new ForbiddenException();

        const tree = await treeDAO.findByID(treeID);

        if (!tree) throw new BadRequestException("Tree does not exist");

        // if (tree.publishedTree === null && tree.published) {
        //     return next();
        // }

        if (!tree.published) {
            return next();
        }

        return next(new ForbiddenException());
    }

    return next();
}
