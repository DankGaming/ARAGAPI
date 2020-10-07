require("dotenv").config();
import express from "express";
import { Request, Response, NextFunction, Application } from "express";

import bodyParser from "body-parser";

// Import routes
import routes from "./api/routes";
import { NotFoundException } from "./api/exceptions/NotFoundException";
import { Exception } from "./api/exceptions/Exception";

const app: Application = express();
const port: number = parseInt(`${process.env.PORT}`, 10) || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome!");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof Exception)) return res.status(500).json(err);

    const error = {
        timestamp: Date.now(),
        code: err.code,
        type: err.constructor.name,
        message: err.message,
    };
    console.error(error);
    return res.status(err.code).json(error);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
