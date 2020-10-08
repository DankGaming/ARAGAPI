require("dotenv").config();
import express from "express";
import { Request, Response, NextFunction, Application } from "express";
import errorHandler from "./api/utils/error-handler";
import bodyParser from "body-parser";
import routes from "./api/routes";
import { Exception } from "./api/exceptions/Exception";

const Layer = require('express/lib/router/layer');

const app: Application = express();
const port: number = parseInt(`${process.env.PORT}`, 10) || 5000;
const handle_request = Layer.prototype.handle_request;

Layer.prototype.handle_request = function (req: Request, res: Response, next: NextFunction) {
    if (!this.isWrapped && this.method) {
        let handle = this.handle;
        this.handle = function (req: Request, res: Response, next: NextFunction) {
            const result = handle.apply(this, arguments);
            result.catch((error: Error) => {
                next(error)
            });
        };
        this.isWrapped = true;
    }
    return handle_request.apply(this, arguments);
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome!");
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
