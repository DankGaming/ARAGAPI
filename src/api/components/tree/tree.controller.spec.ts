import { expect } from "chai";
import sinon, { SinonStub } from "sinon";
import * as treeController from "./tree.controller";
import * as treeDAO from "./tree.dao";
import { Tree } from "./tree.model";

describe("Tree Controller", () => {
    describe("Create", () => {
        it("should create and return a tree", (done: Function) => {
            sinon.stub(treeDAO, "create");
            (treeDAO.create as SinonStub).returns(
                new Promise<number>((res) => res(1))
            );

            const createTreeDTO = {
                name: "Tree",
                creator: 1,
            };

            treeController.create(createTreeDTO).then((result) => {
                expect(result instanceof Tree).to.be.true;
                done();
            });

            (treeDAO.create as SinonStub).restore();
        });
    });
});
