import { IsOptional } from "class-validator";

export class UpdateTreeDTO {
    @IsOptional()
    name?: string;

    @IsOptional()
    creator?: number;

    @IsOptional()
    rootNode?: number;
}
