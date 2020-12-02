require("dotenv").config();
import * as employeeDAO from "../employee/employee.dao";
import { LoginDTO } from "./dto/login.dto";
import { LoginInfo } from "./login-info.model";
import jsonwebtoken from "jsonwebtoken";
import { UnauthorizedException } from "../../../exceptions/UnauthorizedException";

export const login = async (loginDTO: LoginDTO): Promise<LoginInfo> => {
    const { email, password } = loginDTO;
    const employee = await employeeDAO.findByEmail(email, true);

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
