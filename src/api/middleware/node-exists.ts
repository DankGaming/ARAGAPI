import { NextFunction, Request, Response } from "express";
import { getRepository, getTreeRepository } from "typeorm";
import { BadRequestException } from "../../exceptions/BadRequestException";
import { NotFoundException } from "../../exceptions/NotFoundException";
import * as nodeDAO from "../components/tree/node/node.dao";
import { Tree } from "../components/tree/tree.model";

export function nodeExists(nodeParamName: string) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const treeID = +req.params.treeID;
            const nodeID = +req.params[nodeParamName];

            if (!treeID)
                throw new BadRequestException("TreeID cannot be empty");
            if (!nodeID)
                throw new BadRequestException("NodeID cannot be empty");

            const node = await nodeDAO.findByID(treeID, nodeID);

            if (!node) next(new NotFoundException("Node does not exist"));

            next();
        } catch (error) {
            next(error);
        }
    };
}
