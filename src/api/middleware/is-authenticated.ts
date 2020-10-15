import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../../exceptions/UnauthorizedException";
import jsonwebtoken from "jsonwebtoken";
import { Employee } from "../components/employee/employee.model";
import * as employeeDAO from "../components/employee/employee.dao";
import { decode } from "punycode";

declare global {
    namespace Express {
        export interface Request {
            employee: Employee;
        }
    }
}

interface DecodedToken {
    employee: Employee;
    iat: number;
}

export async function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (!req.headers.authorization) throw new UnauthorizedException();
        const privateKey = process.env.JWT_SECRET;
        if (!privateKey) throw new Error("JWT secret must be defined");

        // Get JWT
        const token = req.headers.authorization.split(" ")[1];

        // Check if JWT is valid
        const decodedToken: DecodedToken = jsonwebtoken.verify(
            token,
            privateKey
        ) as DecodedToken;

        const employeeInToken: Employee = decodedToken.employee;

        const employee: Employee = await employeeDAO.findByID(
            employeeInToken.id
        );

        // Add employee to request object
        req.employee = employee;

        next();
    } catch (error) {
        next(error);
    }
}
