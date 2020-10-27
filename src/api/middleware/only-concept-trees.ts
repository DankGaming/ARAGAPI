import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../exceptions/BadRequestException";
import { Exception } from "../../exceptions/Exception";
import { InternalServerException } from "../../exceptions/InternalServerException";
import { HTTPStatus } from "../../utils/http-status-codes";
import * as treeDAO from "../components/tree/tree.dao";
import { Tree } from "../components/tree/tree.model";

export async function onlyConceptTrees(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const treeID: number = parseInt(req.params.treeID);

    if (!treeID) next(new InternalServerException());

    const tree: Tree = await treeDAO.findByID(treeID);

    const isPublishedTree: boolean =
        tree.publishedTree === null && tree.published;

    if (isPublishedTree) {
        next(
            new Exception(
                HTTPStatus.METHOD_NOT_ALLOWED,
                "You can not edit published trees"
            )
        );
    }

    next();
}
