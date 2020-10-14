import { plainToClass } from "class-transformer";
import { ClassType } from "class-transformer/ClassTransformer";
import { validateOrReject } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../exceptions/BadRequestException";

export function parseBody<T>(type: ClassType<T>) {
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
            next(new BadRequestException(errors[0].constraints));
        }
    };
}

export function parseParam(paramName: string, ...functions: Array<Function>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const param = req.params[paramName];
            if (!param)
                throw new BadRequestException(
                    `${paramName} param must be defined`
                );

            console.log(functions);
            functions.forEach((fn: Function) => {
                console.log(fn);
                const result = fn(param);
                console.log(result);
                if (!result) {
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
