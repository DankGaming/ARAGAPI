import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { BadRequestException } from "../../exceptions/BadRequestException";
import { NotFoundException } from "../../exceptions/NotFoundException";
import * as formDAO from "../components/form/form.dao";

export async function formExists(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const formID = +req.params.formID;

        if (!formID) throw new BadRequestException("FormID cannot be empty");

        const form = await formDAO.findByID(formID);

        if (!form) next(new NotFoundException("Form does not exist"));

        next();
    } catch (error) {
        next(error);
    }
}
