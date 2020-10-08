import { NextFunction, Response, Request } from "express";
import { Exception } from "../../exceptions/Exception";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // console.error(err);
    console.log("Error handler");

    const error = {
        timestamp: Date.now(),
        code: err instanceof Exception ? err.code : 500,
        type: err.constructor.name,
        message: err.message,
    };

    return res.status(error.code).json({
        success: false,
        error,
    });
};

export default errorHandler;
