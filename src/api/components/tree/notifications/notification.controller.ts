import * as contentDAO from "../../content/content.dao";
import * as nodeDAO from "../../node/node.dao";
import { Content, ContentType } from "../../content/content.model";
import { UpdateContentDTO } from "../../content/dto/update-content.dto";
import { CreateNotificationDTO } from "./dto/create-notification.dto";

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
    const content: Content = await contentDAO.findByID(id);
    return content;
};

export const remove = async (id: number): Promise<void> => {
    await contentDAO.findByID(id);
    return contentDAO.remove(id);
};

export const update = async (
    id: number,
    updateContentDTO: UpdateContentDTO
): Promise<void> => {
    await contentDAO.findByID(id);
    await contentDAO.update(id, updateContentDTO);
};
