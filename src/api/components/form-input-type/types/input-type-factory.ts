import { FileInputType } from "./file-input-type";
import { InputType } from "./input-type.interface";
import { TextInputType } from "./text-input-type";

export class InputTypeFactory {
    private static typeValidatorRegistry: {
        [typeName: string]: { new (): InputType };
    } = {
        TEXT: TextInputType,
        FILE: FileInputType,
    };

    static create(typeName: string): InputType {
        const cls = this.typeValidatorRegistry[typeName];
        if (!cls) throw new Error("Not found");
        return new cls();
    }
}
