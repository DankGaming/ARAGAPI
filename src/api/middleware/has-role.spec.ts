import { expect } from "chai";
import { Request, Response } from "express";
import sinon, { SinonStub } from "sinon";
import { Role } from "../components/employee/employee.model";
import { hasRole } from "./has-role";
import { getTokenFromRequest } from "./is-authenticated";

describe("HasRole Middleware", () => {
    it("should throw an error if employee does not exist", () => {
        const req = {};

        // expect(
        //     hasRole.bind(this, Role.ADMIN).bind(this, req as Request, {} as Response, () => {})
        // ).to.throw("Authorization header must be present");
    });
});
