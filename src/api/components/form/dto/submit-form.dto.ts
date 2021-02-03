import { IsObject, IsOptional } from "class-validator";
import { ReadStream } from "typeorm/platform/PlatformTools";
import { DTO } from "../../../../utils/DTO";

export class SubmitFormDTO extends DTO {
    @IsObject()
    answers: {
        [question: number]: number;
    };

    @IsObject()
    form: {
        [key: string]: any;
    };

    // @IsOptional()
    // @IsObject()
    // attachments: {
    //     [key: string]: {
    //         stream: ReadStream;
    //         name: string;
    //     };
    // };

    @IsOptional()
    @IsOptional()
    attachments: {
        [key: string]: {
            path: string;
            name: string;
        };
    };
}
