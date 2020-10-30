import { UpdateNodeDTO } from "./dto/update-node.dto";
import * as nodeDAO from "../node/node.dao";

export class Node {
    id: number;
    parent: number;
    content: number;
    createdAt: Date;
    updatedAt: Date;

    async update(updateNodeDTO: UpdateNodeDTO): Promise<void> {
        await nodeDAO.update(this.id, updateNodeDTO);
    }

    async remove() {
        await nodeDAO.remove(this.id);
    }

    async unlink() {
        await nodeDAO.unlink(this.id);
    }
}
