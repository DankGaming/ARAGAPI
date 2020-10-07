import { NotFoundException } from "../../exceptions/NotFoundException";

export class EmployeeService {
    async getEmployee(id: number) {
        const result = null;
        if (result) return result;
        else throw new NotFoundException();
    }
}