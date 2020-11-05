import { IsOptional } from "class-validator";
import { DTO } from "../../../../utils/DTO";
import { Role } from "../employee.model";

export class UpdateEmployeeDTO extends DTO {
    @IsOptional()
    firstname?: string;

    @IsOptional()
    lastname?: string;

    @IsOptional()
    email?: string;

    @IsOptional()
    role?: Role;
}
