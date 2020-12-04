import * as nodeDAO from "../node/node.dao";
import * as treeDAO from "../tree.dao";
import * as nodeController from "../node/node.controller";
import { CreateNotificationDTO } from "./dto/create-notification.dto";
import { UpdateNotificationDTO } from "./dto/update-notification.dto";
import { Node } from "../node/node.model";
import { FilterNodeDTO } from "../node/dto/filter-node.dto";
import { NotFoundException } from "../../../../exceptions/NotFoundException";
import { ContentType } from "../node/content-type";

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

    if (dto.next) await nodeController.link(treeID, notification.id, dto.next);
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
    if (dto.next) await nodeController.link(treeID, notificationID, dto.next);
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
