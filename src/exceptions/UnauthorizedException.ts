import { HTTPStatus } from "../utils/http-status-codes";
import { Exception } from "./Exception";

export class UnauthorizedException extends Exception {
    constructor(public message: string = "Not Authorized") {
        super(HTTPStatus.UNAUTHORIZED, message);
    }
}
