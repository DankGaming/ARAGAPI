import { InputType } from "./input-type.interface";
export class FileInputType implements InputType {
    private static acceptedContentTypes = [
        "application/pdf",
        "application/json",
        "image/png",
        "image/jpeg",
        "text/plain",
        "text/csv",
        "text/html",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    parse(value: any): any {
        if (!FileInputType.acceptedContentTypes.includes(value)) return false;
        return true;
    }
}
