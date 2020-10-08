import { NextFunction, Response, Request } from "express";
import { Exception } from "../exceptions/Exception";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    let code = 500;
    if (err instanceof Exception) code = err.code;

    const error = {
        timestamp: Date.now(),
        code,
        type: err.constructor.name,
        message: err.message
    }

    return res.status(error.code).json({
        success: false,
        error
    });

}

export default errorHandler;
