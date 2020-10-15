import { Request, Response, NextFunction } from "express";

export async function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Get JWT
    // Check if JWT is valid
    // Get employeeID from JWT
    // Request employee from employeeDAO
    // Add employee to req.employee
    // Call next
}
