import { HTTPStatus } from "../utils/http-status-codes";
import { Exception } from "./Exception";

export class PreConditionFailedException extends Exception {
    constructor(public message: string = "Precondition failed") {
        super(HTTPStatus.PRECONDITION_FAILED, message);
    }
}
