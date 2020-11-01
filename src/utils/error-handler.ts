import { NextFunction, Response, Request } from "express";
import { Exception } from "../exceptions/Exception";
import logger from "../utils/logger";

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

    if (error.code >= 500 && error.code < 600) {
        console.error(error.type + ": " + error.message);
        // Send copy to logger to avoid adding 'level' attribute to object
        logger.error({ ...error });
        // Hide the error details from the user
        error.message = "Something went wrong";
    }

    return res.status(error.code).json({
        success: false,
        error,
    });
};

export default errorHandler;
