require("dotenv").config();
import express from "express";
import cors from "cors";
import { Application } from "express";
import errorHandler from "./utils/error-handler";
import bodyParser from "body-parser";
import routes from "./api/routes";
import logger from "./utils/logger";
import { jsonBodyParserMiddleware } from "./utils/request-handler";
import "./utils/connection";

const app: Application = express();
const port: number = 3000;

app.use(cors());
app.use(jsonBodyParserMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));

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
