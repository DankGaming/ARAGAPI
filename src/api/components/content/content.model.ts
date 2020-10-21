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
        const linkingNode: Node = await nodeDAO.findByContentID(this.id);

        try {
            const node: Node = await nodeDAO.findByContentID(content);

            console.log(node);

            const currentLinkedNode: Node = await nodeDAO.findParentByChildID(
                linkingNode.id
            );

            currentLinkedNode.unlink();

            // Update node
            node.update({ parent: linkingNode.id });
        } catch (error) {
            if (!(error instanceof NotFoundException)) throw error;

            console.log("sds");

            await nodeDAO.create({
                parent: linkingNode.id,
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
