import { NextFunction } from "express";

export class NotFoundException extends Error {
    
    constructor(public message: string = "Not Found Exception") {
        super(message);
        console.log("New NotFoundException");
    }
}