import { Node } from "../node/node.model";
import { Tree } from "../tree/tree.model";
import * as nodeDAO from "../node/node.dao";
import { NotFoundException } from "../../../exceptions/NotFoundException";

export class Content {
    id: number;
    content: string;
    type: ContentType;
    tree: number;
    node?: Node;
    createdAt: Date;
    updatedAt: Date;

    async link(content: number) {
        // Check if node already exists
        try {
            const node: Node = await nodeDAO.findByContentID(content);
            // const linkingNode: Node = await nodeDAO.findByContentID(this.id);
            // // Update node
            // node.update({ parent: linkingNode.id });
        } catch (error) {
            if (!(error instanceof NotFoundException)) throw error;
            const node: Node = await nodeDAO.findByContentID(this.id);

            await nodeDAO.create({
                parent: node.id,
                content,
            });
        }
    }

    async unlink() {
        const node: Node = await nodeDAO.findByContentID(this.id);
        node.remove();
    }
}

export enum ContentType {
    QUESTION = "QUESTION",
    ANSWER = "ANSWER",
    NOTIFICATION = "NOTIFICATION",
}
