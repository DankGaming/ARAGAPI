import { plainToClass } from "class-transformer";
import { ClassType } from "class-transformer/ClassTransformer";
import { validateOrReject } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../exceptions/BadRequestException";
import { DTO } from "../DTO";
import { Filter } from "../filter";

/**
 * Parse body to a DTO class and check if all properties are valid
 * @param type a DTO class which should extend from the base DTO class
 */
export function parseBody<T extends DTO>(type: ClassType<T>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        const cls = plainToClass(type, req.body);

        try {
            await validateOrReject(cls, {
                skipUndefinedProperties: false,
                skipNullProperties: false,
                skipMissingProperties: false,
                forbidUnknownValues: true,
            });

            req.body = cls;

            next();
        } catch (errors) {
            const message =
                errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            next(new BadRequestException(message));
        }
    };
}

/**
 * Parse a specific param defined in the Express route
 * @param paramName the param name defined in the Express route
 * @param functions an array of functions
 */
export function parseParam(paramName: string, ...functions: Array<Function>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const param = req.params[paramName];
            if (!param)
                throw new BadRequestException(
                    `${paramName} param must be defined`
                );

            functions.forEach((fn: Function) => {
                if (!fn(param)) {
                    throw new BadRequestException(
                        `${paramName} param is not correct`
                    );
                }
            });

            next();
        } catch (error) {
            next(error);
        }
    };
}

declare global {
    namespace Express {
        export interface Request {
            filter: Filter;
        }
    }
}

export function parseFilter<T extends Filter>(type: ClassType<T>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        const cls = plainToClass(type, req.query);

        try {
            await validateOrReject(cls, {
                skipUndefinedProperties: false,
                skipNullProperties: false,
                skipMissingProperties: true,
                forbidUnknownValues: true,
            });

            req.filter = cls;

            next();
        } catch (errors) {
            const message =
                errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            next(new BadRequestException(message));
        }
    };
}
