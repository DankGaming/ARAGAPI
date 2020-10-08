import { Request, Response, NextFunction } from "express";

const Layer = require('express/lib/router/layer');
const handle_request = Layer.prototype.handle_request;

Layer.prototype.handle_request = function (req: Request, res: Response, next: NextFunction) {
    if (!this.isWrapped && this.method) {
        let handle = this.handle;
        this.handle = function (req: Request, res: Response, next: NextFunction) {
            const result = handle.apply(this, arguments);
            if (result.catch) {
                result.catch((error: Error) => next(error));
            }
        };
        this.isWrapped = true;
    }
    return handle_request.apply(this, arguments);
};