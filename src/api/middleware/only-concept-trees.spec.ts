import { expect } from "chai";
import { NextFunction, Request, Response } from "express";
import { authenticate, isAuthenticated } from "./is-authenticated";
import sinon, { SinonStub } from "sinon";
import { onlyConceptTrees } from "./only-concept-trees";

describe("Concept tree authorization middleware", () => {
    it("Should call the next function with an error if an unauthorized user requests a concept tree", () => {
        const req: Partial<Request> = {};

        const nextSpy = sinon.spy();

        onlyConceptTrees(
            req as Request,
            {} as Response,
            nextSpy as NextFunction
        );

        //sinon.assert.neverCalledWith(nextSpy, "foo");
    });
});
