import { HTTPStatus } from "../utils/http-status-codes";
import { Exception } from "./Exception";

export class ForbiddenException extends Exception {
    constructor(public message: string = "Forbidden") {
        super(HTTPStatus.FORBIDDEN, message);
    }
}
