require("dotenv").config()
import express from "express";
import { Request, Response, NextFunction, Application } from "express";

import bodyParser from "body-parser";

// Import routes
import routes from "./api/routes";

const app: Application = express();
const port: number = parseInt(`${process.env.PORT}`, 10) || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome!");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log("ERROR HANDLING FUNCTION");
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});