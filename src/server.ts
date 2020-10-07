import express from "express";
import bodyParser from "body-parser";

import { port } from "./config";

const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("sdsd");
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});