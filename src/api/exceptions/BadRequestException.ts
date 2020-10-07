import { HTTPStatus } from "../utils/http-status-codes";
import { Exception } from "./Exception";

export class BadRequestException extends Exception {
    constructor(public message: string = "Bad Request") {
        super(HTTPStatus.BAD_REQUEST, message);
    }
}
