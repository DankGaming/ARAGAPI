import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";
import { Filter } from "../../../../utils/filter";

export class FilterTreeDTO extends Filter {
    @IsOptional()
    @Transform((concept) => concept === "true", { toClassOnly: true })
    concept?: boolean;
}
