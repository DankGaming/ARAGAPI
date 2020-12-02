import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../exceptions/BadRequestException";
import { Exception } from "../../exceptions/Exception";
import { InternalServerException } from "../../exceptions/InternalServerException";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { HTTPStatus } from "../../utils/http-status-codes";
import * as treeDAO from "../components/tree/tree.dao";
import { Tree } from "../components/tree/tree.model";

/**
 * Middleware which only allows concept trees.
 * @param req
 * @param res
 * @param next
 */
export async function onlyConceptTrees(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const treeID: number = +req.params.treeID;

    if (!treeID) next(new InternalServerException());

    const isPublishedVersion = await treeDAO.isPublishedVersion(treeID);

    console.log(isPublishedVersion);

    if (isPublishedVersion)
        next(
            new Exception(
                HTTPStatus.METHOD_NOT_ALLOWED,
                "You can not edit published trees"
            )
        );

    next();
}
