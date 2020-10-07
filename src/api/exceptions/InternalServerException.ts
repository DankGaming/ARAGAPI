import { HTTPStatus } from "../utils/http-status-codes";
import { Exception } from "./Exception";

export class InternalServerException extends Exception {
    constructor(public message: string = "Internal Server Error") {
        super(HTTPStatus.INTERNAL_SERVER_ERROR, message);
    }
}
