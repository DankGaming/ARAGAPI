require("dotenv").config();
import { createPool } from "mysql2";

const tableFileNames: string[] = [];
const pool = createPool({
    host: "db",
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
    namedPlaceholders: true,
    multipleStatements: true,
});

pool.getConnection(async (err) => {
    if (err) return console.error("Error connecting with database: " + err);
});

export default pool.promise();
