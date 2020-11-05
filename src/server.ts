require("dotenv").config();
import express from "express";
import { Request, Response, NextFunction, Application } from "express";
import errorHandler from "./utils/error-handler";
import bodyParser from "body-parser";
import routes from "./api/routes";
import winston from "winston";
import expressWinston from "express-winston";
import logger from "./utils/logger";

const Layer = require("express/lib/router/layer");

const app: Application = express();
const port: number = parseInt(`${process.env.PORT}`, 10) || 5000;

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    expressWinston.logger({
        transports: [
            new winston.transports.File({
                filename: "combined.log",
                level: "info",
            }),
        ],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json()
        ),
    })
);

app.use(routes);
app.use(errorHandler);

/**
 * Start server on specified port
 */
app.listen(port, () => {
    const message = `Server started on port ${port}`;
    console.log(message);
    logger.info(message);
});
