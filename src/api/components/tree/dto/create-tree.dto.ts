import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateTreeDTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    creator: number;

    // @IsNotEmpty()
    // published: boolean = false;
}
