import { NotFoundException } from "../../../exceptions/NotFoundException";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import database from "../../../utils/database";

export const getAll = async () => {
    const [rows] = await database.execute("SELECT * FROM employee");
    return rows;
};

export const getByID = async (id: number) => {
    const result = null;
    if (result) return result;
    else throw new NotFoundException();
};

export const createEmployee = async (createEmployeeDTO: CreateEmployeeDTO) => {
    throw new NotFoundException();
    return {
        id: 1,
        ...createEmployeeDTO,
    };
};
