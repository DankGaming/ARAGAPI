import { IsNotEmpty } from "class-validator";

export class CreateTreeDTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    creatorID: number;
}
