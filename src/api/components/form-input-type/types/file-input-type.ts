import { InputType } from "./input-type.interface";
export class FileInputType implements InputType {
    parse(value: any): any {
        return value;
    }
}
