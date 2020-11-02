import winston from "winston";

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: "logs.log",
        }),
    ],
});

export default logger;
