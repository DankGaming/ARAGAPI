import { IsOptional } from "class-validator";

export class UpdateEmployeeDTO {
    @IsOptional()
    firstname?: string;

    @IsOptional()
    lastname?: string;

    @IsOptional()
    email?: string;
}
