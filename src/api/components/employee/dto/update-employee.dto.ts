import { IsOptional } from "class-validator";
import { Role } from "../employee.model";

export class UpdateEmployeeDTO {
    @IsOptional()
    firstname?: string;

    @IsOptional()
    lastname?: string;

    @IsOptional()
	email?: string;
	
	@IsOptional()
    role?: Role;
}
