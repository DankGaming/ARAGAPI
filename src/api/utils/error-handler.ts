import { NextFunction, Response, Request } from "express";
import { Exception } from "../exceptions/Exception";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof Exception)) return res.status(500).json(err);

    const error = {
        timestamp: Date.now(),
        code: err.code,
        type: err.constructor.name,
        message: err.message,
    };
    console.error(error);
    return res.status(err.code).json({
        success: false,
        error
    });
}

export default errorHandler;
