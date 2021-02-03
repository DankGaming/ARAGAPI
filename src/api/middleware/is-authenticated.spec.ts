import { expect } from "chai";
import { Request } from "express";
import { getTokenFromRequest } from "./is-authenticated";

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
});
