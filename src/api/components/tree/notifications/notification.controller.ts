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
    await nodeDAO.create({ content: id });
    const notification: Content = await contentDAO.findByID(id);

    if (createNotificationDTO.link)
        notification.link(createNotificationDTO.link);

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
        const node: Node = await nodeDAO.findByContentID(
            updateNotificationDTO.link
        );
        const content: Content = await contentDAO.findByID(node.content);
        const answer: Content = await contentDAO.findByID(id);
        answer.link(content.id);
    }
};
