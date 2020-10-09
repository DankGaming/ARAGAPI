require("dotenv").config();
import glob from "glob";
import path from "path";
import { createPool } from "mysql2";

const tableFileNames: string[] = [];
const pool = createPool({
    host: "db",
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
});

// Get all table definition files
glob.sync(
    path.join(__dirname, "..", "api", "components", "**/*.table.ts")
).forEach((file) => tableFileNames.push(file));

pool.getConnection(async (err, connection) => {
    if (err) return console.error("Error connecting with database: " + err);
    try {
        // Import all table definition files and create SQL table
        tableFileNames.forEach(async (file) => {
            const importedFile = require(path.resolve(file));
            if (importedFile.up) await pool.execute(importedFile.up);
        });
    } catch (error) {
        console.error("Error creating database tables: " + error);
    }
});

export default pool.promise();
