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
): Promise<Node> => {
    const notification: Node = await nodeDAO.update(
        treeID,
        notificationID,
        dto
    );

    if (dto.root) {
        await treeDAO.update(treeID, { root: notificationID });
    }

    if (dto.next) await nodeDAO.link(notificationID, dto.next);

    console.log(parent);

    return notification;
};

// export const unlink = async (notificationID: number): Promise<void> => {
//     const notification = await nodeDAO.findByID(notificationID);

//     if (!notification) throw new NotFoundException("Notification does not exist");

//     await nodeDAO.unlink(notificationID, );
// };
