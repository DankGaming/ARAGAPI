import { InputType } from "./input-type.interface";

export class TextInputType implements InputType {
    parse(value: any): any {
        return value;
    }
}
