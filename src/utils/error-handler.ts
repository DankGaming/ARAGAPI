import { NextFunction, Response, Request } from "express";
import { Exception } from "../exceptions/Exception";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const error = {
        timestamp: Date.now(),
        code: err instanceof Exception ? err.code : 500,
        type: err.constructor.name,
        message: err.message,
    };

    if (error.code >= 500 && error.code < 600)
        console.error(error.type + ": " + error.message);

    return res.status(error.code).json({
        success: false,
        error,
    });
};

export default errorHandler;
