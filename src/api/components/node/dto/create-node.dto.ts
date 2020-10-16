import { IsNotEmpty } from "class-validator";

export class CreateNodeDTO {
    parent?: number;

    @IsNotEmpty()
    content: number;
}
