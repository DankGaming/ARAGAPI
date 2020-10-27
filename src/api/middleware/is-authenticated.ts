import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../../exceptions/UnauthorizedException";
import jsonwebtoken from "jsonwebtoken";
import { Employee } from "../components/employee/employee.model";
import * as employeeDAO from "../components/employee/employee.dao";

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
    if (!(await authenticate(req))) {
        return next(new UnauthorizedException());
    }

    next();
}

export async function authenticate(req: Request): Promise<Boolean> {
    try {
        const privateKey = process.env.JWT_SECRET;
        if (!privateKey) throw new Error("JWT secret must be defined");

        // Get JWT
        const token = getTokenFromRequest(req);

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

        return true;
    } catch (error) {
        return false;
    }
}

export async function mayBeAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    await authenticate(req);
    next();
}

export function getTokenFromRequest(req: Request): string {
    if (!req.headers.authorization)
        throw new UnauthorizedException("Authorization header must be present");
    const token = req.headers.authorization.split(" ")[1];
    if (!token) throw new UnauthorizedException("Token must be a bearer token");
    return token;
}
