require("dotenv").config();
import * as employeeDAO from "../employee/employee.dao";
import { Employee } from "../employee/employee.model";
import { LoginDTO } from "./dto/login.dto";
import { LoginInfo } from "./login-info.model";
import jsonwebtoken from "jsonwebtoken";
import { Exception } from "../../../exceptions/Exception";
import { HTTPStatus } from "../../../utils/http-status-codes";
import { UnauthorizedException } from "../../../exceptions/UnauthorizedException";

export const login = async (loginDTO: LoginDTO): Promise<LoginInfo> => {
    const { email, password } = loginDTO;
    const employee: Employee = await employeeDAO.findByEmailWithPassword(email);

    if (!employee) throw new UnauthorizedException("Login info incorrect");

    const passwordIsCorrect: boolean = await employee.checkPassword(password);
    delete employee.password;

    if (!passwordIsCorrect)
        throw new UnauthorizedException("Login info incorrect");

    const privateKey = process.env.JWT_SECRET;
    if (!privateKey) throw new Error("JWT secret must be defined");
    const JWT = jsonwebtoken.sign({ employee }, privateKey);

    return {
        employee,
        JWT,
    };
};
