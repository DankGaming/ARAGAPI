import { IsEnum, IsOptional } from "class-validator";
import { Filter } from "../../../../../utils/filter";
import { ContentType } from "../content-type";

export class FilterAcyclicGraphDTO extends Filter {
    @IsOptional()
    start?: number;

    @IsOptional()
    @IsEnum(ContentType)
    end?: ContentType;

    @IsOptional()
    search?: string;
}
