import * as contentDAO from "../../content/content.dao";
import * as nodeDAO from "../node/node.dao";
import * as treeDAO from "../tree.dao";
import { Content, ContentType } from "../../content/content.model";
import { UpdateContentDTO } from "../../content/dto/update-content.dto";
import { CreateNotificationDTO } from "./dto/create-notification.dto";
import { UpdateNotificationDTO } from "./dto/update-notification.dto";
import { Node } from "../node/node.model";
import { FilterNodeDTO } from "../node/dto/filter-node.dto";
import { getRepository, Repository } from "typeorm";
import { NotFoundException } from "../../../../exceptions/NotFoundException";
import { BadRequestException } from "../../../../exceptions/BadRequestException";

export const findAll = async (
    treeID: number,
    filter: FilterNodeDTO
): Promise<Node[]> => {
    filter.type = ContentType.NOTIFICATION;
    const notifications: Node[] = await nodeDAO.findAll(treeID, filter);
    return notifications;
};

export const create = async (
    treeID: number,
    dto: CreateNotificationDTO
): Promise<Node> => {
    const notification: Node = await nodeDAO.create(treeID, dto);

    if (dto.next) await nodeDAO.link(notification.id, dto.next);
    if (dto.root) await treeDAO.update(treeID, { root: notification.id });

    return notification;
};

export const update = async (
    treeID: number,
    notificationID: number,
    dto: UpdateNotificationDTO
): Promise<void> => {
    await nodeDAO.update(treeID, notificationID, dto);

    if (dto.root) await treeDAO.update(treeID, { root: notificationID });
    if (dto.next) await link(treeID, notificationID, dto.next);
};

const link = async (
    treeID: number,
    notificationID: number,
    nextID: number
): Promise<void> => {
    const notification = (await nodeDAO.findByID(treeID, notificationID))!;

    /**
     * If notification already has a linked node, delete it and create a new one
     */
    if (notification.children.length !== 0) {
        /**
         * Notification has already a linked node, so delete all children (Even though there shouldn't be more than 1 child)
         */
        for (const child of notification.children)
            await nodeDAO.unlink(notificationID, child.id);
    }

    await nodeDAO.link(notificationID, nextID);
};

/**
 * Delete a link between an answer and another node
 * @param treeID
 * @param notificationID
 */
export const unlink = async (
    treeID: number,
    notificationID: number
): Promise<void> => {
    const notification = await nodeDAO.findByID(treeID, notificationID);

    if (!notification)
        throw new NotFoundException("Notification does not exist");

    for (const child of notification.children) {
        await nodeDAO.unlink(notificationID, child.id);
    }
};
