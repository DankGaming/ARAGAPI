import { NextFunction, Request, Response } from "express";
import { nextTick } from "process";
import { getRepository, getTreeRepository } from "typeorm";
import { BadRequestException } from "../../exceptions/BadRequestException";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { Tree } from "../components/tree/tree.model";

export async function treeExists(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const treeID = +req.params.treeID;

        if (!treeID) throw new BadRequestException("TreeID cannot be empty");

        const tree = await getRepository(Tree).findOne(treeID);

        if (!tree) next(new NotFoundException("Tree does not exist"));

        next();
    } catch (error) {
        next(error);
    }
}
