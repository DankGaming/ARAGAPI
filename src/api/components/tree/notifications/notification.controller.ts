import * as contentDAO from "../../content/content.dao";
import * as nodeDAO from "../../node/node.dao";
import { Content, ContentType } from "../../content/content.model";
import { UpdateContentDTO } from "../../content/dto/update-content.dto";
import { CreateNotificationDTO } from "./dto/create-notification.dto";
import { UpdateNotificationDTO } from "./dto/update-notification.dto";
import { Node } from "../../node/node.model";

export const findAll = async (): Promise<Content[]> => {
    const content: Content[] = await contentDAO.findAll({
        type: ContentType.NOTIFICATION,
    });
    return content;
};

export const findAllByTree = async (tree: number): Promise<Content[]> => {
    const content: Content[] = await contentDAO.findAll({
        tree,
        type: ContentType.NOTIFICATION,
    });
    return content;
};

export const findByID = async (id: number): Promise<Content> => {
    const content: Content = await contentDAO.findByID(id);
    return content;
};

export const create = async (
    treeID: number,
    createNotificationDTO: CreateNotificationDTO
): Promise<Content> => {
    const id: number = await contentDAO.create(treeID, createNotificationDTO);
    const nodeID = await nodeDAO.create({ content: id });
    const notification: Content = await contentDAO.findByID(id);

    if (createNotificationDTO.link) {
        const linkedNode: Node = await nodeDAO.findByContentID(
            createNotificationDTO.link
        );

        nodeDAO.update(linkedNode.id, {
            parent: nodeID,
        });
    }

    return notification;
};

export const remove = async (id: number): Promise<void> => {
    await contentDAO.findByID(id);
    return contentDAO.remove(id);
};

export const update = async (
    id: number,
    updateNotificationDTO: UpdateNotificationDTO
): Promise<void> => {
    await contentDAO.findByID(id);
    await contentDAO.update(id, updateNotificationDTO);

    if (updateNotificationDTO.link) {
        const notificationNode: Node = await nodeDAO.findByContentID(id);

        try {
            const oldNode: Node = await nodeDAO.findParentByChildID(
                notificationNode.id
            );

            await nodeDAO.unlink(oldNode.id);
        } catch (error) {
            // Do nothing
        }

        const linkNode: Node = await nodeDAO.findByContentID(
            updateNotificationDTO.link
        );

        await nodeDAO.update(linkNode.id, {
            parent: notificationNode.id,
        });
    }
};
