import { IsOptional } from "class-validator";
import { UpdateNodeDTO } from "../../node/dto/update-node.dto";

export class UpdateNotificationDTO extends UpdateNodeDTO {
    @IsOptional()
    next?: number;

    @IsOptional()
    root?: boolean;
}
