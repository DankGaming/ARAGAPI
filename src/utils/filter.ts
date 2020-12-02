import { IsEnum, IsIn, IsOptional } from "class-validator";
import { CommaSeperatedEnum } from "./decorators/comma-seperated..decorator";
import { DTO } from "./DTO";

export enum OrderDirection {
    ASC = "ASC",
    DESC = "DESC",
}

/**
 * Base filter class
 */
export class Filter extends DTO {
    @IsOptional() skip?: number;
    @IsOptional() take?: number;
    @IsOptional() order?: string;

    @IsOptional()
    @CommaSeperatedEnum(OrderDirection)
    orderDirection?: OrderDirection;
}
