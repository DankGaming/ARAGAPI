import { HTTPStatus } from "../utils/http-status-codes";
import { Exception } from "./Exception";

export class NotFoundException extends Exception {
    constructor(public message: string = "Not Found") {
        super(HTTPStatus.NOT_FOUND, message);
    }
}
