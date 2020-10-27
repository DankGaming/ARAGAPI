import { Request, Response, NextFunction } from "express";
import { ForbiddenException } from "../../exceptions/ForbiddenException";
import { UnauthorizedException } from "../../exceptions/UnauthorizedException";
import { Employee, Role } from "../components/employee/employee.model";

export function hasRole(...roles: Role[]) {
    return async function (req: Request, res: Response, next: NextFunction) {
        const employee: Employee = req.employee;

        if (!employee) next(new UnauthorizedException());

        const hasRole: boolean = roles.includes(employee.role);

        if (!hasRole)
            next(
                new ForbiddenException(
                    `Employee needs one of the following roles: ${roles}`
                )
            );

        next();
    };
}
