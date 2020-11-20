import { NextFunction, Response, Request } from "express";
import { Exception } from "../exceptions/Exception";
import logger from "../utils/logger";
import { HTTPStatus } from "./http-status-codes";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errorCode: HTTPStatus =
        err instanceof Exception ? err.code : HTTPStatus.INTERNAL_SERVER_ERROR;

    /**
     * Create an error object to send back to the client
     */
    const error = {
        timestamp: Date.now(),
        code: errorCode,
        type: err.constructor.name,
        message: err.message,
    };

    /**
     * If the error is an internal server error, log the error and hide the error details from the client
     */
    if (error.code == HTTPStatus.INTERNAL_SERVER_ERROR) {
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
