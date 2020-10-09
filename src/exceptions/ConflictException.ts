import { HTTPStatus } from "../utils/http-status-codes";
import { Exception } from "./Exception";

export class ConflictException extends Exception {
    constructor(public message: string = "Conflict") {
        super(HTTPStatus.CONFLICT, message);
    }
}
