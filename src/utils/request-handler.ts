import { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { BadRequestException } from "../exceptions/BadRequestException";

const Layer = require("express/lib/router/layer");
const handle_request = Layer.prototype.handle_request;

/**
 * Response handler: catch all uncatched errors and send them to the error handler with next function. This avoids numerous try catch blocks in each route
 */
Layer.prototype.handle_request = function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!this.isWrapped && this.method) {
        let handle = this.handle;
        this.handle = async function (
            req: Request,
            res: Response,
            next: NextFunction
        ) {
            try {
                await handle.apply(this, arguments);
            } catch (error) {
                next(error);
            }
        };
        this.isWrapped = true;
    }
    return handle_request.apply(this, arguments);
};

export const jsonBodyParserMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const middleware = bodyParser.json();
    middleware(req, res, (err) => {
        if (err) return next(new BadRequestException(err.message));
        next();
    });
};
