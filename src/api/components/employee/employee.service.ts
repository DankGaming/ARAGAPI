import { BadRequestException } from "../../exceptions/BadRequestException";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";

export const getEmployee = async (id: number) => {
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
