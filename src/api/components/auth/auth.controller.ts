require("dotenv").config();
import * as employeeDAO from "../employee/employee.dao";
import { Employee } from "../employee/employee.model";
import { LoginDTO } from "./dto/login.dto";
import { LoginInfo } from "./login-info.model";
import jsonwebtoken from "jsonwebtoken";
import { Exception } from "../../../exceptions/Exception";
import { HTTPStatus } from "../../../utils/http-status-codes";

export const login = async (loginDTO: LoginDTO): Promise<LoginInfo> => {
    const { email, password } = loginDTO;
    const employee: Employee = await employeeDAO.findByEmail(email);

    console.log("1");

    if (!employee)
        throw new Exception(HTTPStatus.UNAUTHORIZED, "Login info incorrect");

    console.log(employee);
    const passwordIsCorrect: boolean = await employee.checkPassword(password);
    delete employee.password;

    console.log("2");

    if (!passwordIsCorrect)
        throw new Exception(HTTPStatus.UNAUTHORIZED, "Login info incorrect");

    console.log("3");

    const privateKey = process.env.JWT_SECRET;
    if (!privateKey) throw new Error("JWT secret must be defined");
    const JWT = jsonwebtoken.sign({ employee }, privateKey);

    console.log("4");

    return {
        employee,
        JWT,
    };
};
