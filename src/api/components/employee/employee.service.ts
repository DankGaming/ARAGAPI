import { BadRequestException } from "../../exceptions/BadRequestException";
import { Exception } from "../../exceptions/Exception";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { HTTPStatus } from "../../utils/http-status-codes";

export class EmployeeService {
    async getEmployee(id: number) {
        const result = null;
        if (result) return result;
        else throw new NotFoundException();
    }
}