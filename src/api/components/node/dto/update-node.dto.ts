import { IsOptional } from "class-validator";

export class UpdateNodeDTO {
    @IsOptional()
    parent?: number;

    @IsOptional()
    content?: number;
}
