import { IsEnum, IsOptional } from "class-validator";
import { Filter } from "../../../../../utils/filter";
import { ContentType } from "../content-type";

export class FilterNodeDTO extends Filter {
    @IsOptional()
    @IsEnum(ContentType)
    type?: ContentType;
}
