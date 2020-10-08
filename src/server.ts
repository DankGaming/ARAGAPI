require("dotenv").config();
import express from "express";
import { Request, Response, NextFunction, Application } from "express";
import errorHandler from "./api/utils/error-handler";

import bodyParser from "body-parser";

// Import routes
import routes from "./api/routes";
import { Exception } from "./api/exceptions/Exception";

const app: Application = express();
const port: number = parseInt(`${process.env.PORT}`, 10) || 5000;

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
