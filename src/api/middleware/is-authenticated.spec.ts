import { expect } from "chai";
import { Request, Response } from "express";
import { authenticate, isAuthenticated } from "./is-authenticated";
import sinon, { SinonStub } from "sinon";
import jsonwebtoken from "jsonwebtoken";
import { Employee, Role } from "../components/employee/employee.model";
import { getTokenFromRequest } from "./is-authenticated";
import * as employeeDAO from "../components/employee/employee.dao";

describe("Authentication middleware", () => {
    it("should throw an error if authorization header is not present", () => {
        const req: Partial<Request> = {
            headers: {
                authorization: undefined,
            },
        };

        expect(getTokenFromRequest.bind(this, req as Request)).to.throw(
            "Authorization header must be present"
        );
    });

    it("should throw an error if authorization header is only one string", () => {
        const req = {
            headers: {
                authorization: "abc",
            },
        };

        expect(getTokenFromRequest.bind(this, req as Request)).to.throw(
            "Token must be a bearer token"
        );
    });

    // it("should yield an employee object after decoding token", async () => {
    //     const employee = {
    //         id: 1,
    //         firstname: "Firstname",
    //         lastname: "Lastname",
    //         email: "firstname@mail.com",
    //         role: Role.STANDARD,
    //     };

    //     const req = {};

    //     sinon.stub(jsonwebtoken, "verify");
    //     (jsonwebtoken.verify as SinonStub).returns({ employee });

    //     sinon.stub(employeeDAO, "findByID");
    //     (employeeDAO.findByID as SinonStub).returns(employee);

    //     await authenticate(req as Request);
    //     console.log(req);
    //     expect(req).to.have.property("employee");
    //     (jsonwebtoken.verify as SinonStub).restore();
    //     (employeeDAO.findByID as SinonStub).restore();
    // });
});
