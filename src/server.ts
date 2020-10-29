require("dotenv").config();
import express from "express";
import { Request, Response, NextFunction, Application } from "express";
import errorHandler from "./utils/error-handler";
import bodyParser from "body-parser";
import routes from "./api/routes";
import { NotFoundException } from "./exceptions/NotFoundException";
import winston from "winston";
import expressWinston from "express-winston";
import { ConsoleTransportOptions } from "winston/lib/winston/transports";

const Layer = require("express/lib/router/layer");

const app: Application = express();
const port: number = parseInt(`${process.env.PORT}`, 10) || 5000;

const handle_request = Layer.prototype.handle_request;

// Response handler
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
            })
        ],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json()
        ),
    })
);

app.use(routes);

app.get("/", (req: Request, res: Response) => {
    res.json({
        success: true,
        result: {
            message: "Welcome to the ARAG REST API",
        },
    });
});

// Not found route
app.use("*", (req: Request, res: Response) => {
    throw new NotFoundException("Route not found");
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught exception: " + err);
});
