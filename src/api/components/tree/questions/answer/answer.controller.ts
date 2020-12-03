import { CreateAnswerDTO } from "./dto/create-answer.dto";
import * as nodeDAO from "../../node/node.dao";
import { Node } from "../../node/node.model";
import { UpdateAnswerDTO } from "./dto/update-answer.dto";
import { NotFoundException } from "../../../../../exceptions/NotFoundException";
import { BadRequestException } from "../../../../../exceptions/BadRequestException";

export const create = async (
    treeID: number,
    questionID: number,
    dto: CreateAnswerDTO
): Promise<Node> => {
    const answer: Node = await nodeDAO.create(treeID, dto);

    /**
     * Link question to answer
     */
    await nodeDAO.link(questionID, answer.id);

    /**
     * Link answer to another node if specified in DTO
     */
    if (dto.next) nodeDAO.link(answer.id, dto.next);

    return answer;
};

export const update = async (
    treeID: number,
    answerID: number,
    dto: UpdateAnswerDTO
): Promise<void> => {
    await nodeDAO.update(treeID, answerID, dto);

    if (dto.next) await link(treeID, answerID, dto.next);
};

const link = async (
    treeID: number,
    answerID: number,
    nextID: number
): Promise<void> => {
    const answer = (await nodeDAO.findByID(treeID, answerID))!;

    /**
     * If notification already has a linked node, delete it and create a new one
     */
    if (answer.children.length !== 0) {
        /**
         * Notification has already a linked node, so delete all children (Even though there shouldn't be more than 1 child)
         */
        for (const child of answer.children)
            await nodeDAO.unlink(answerID, child.id);
    }

    await nodeDAO.link(answerID, nextID);
};

/**
 * Delete a link between an answer and another node
 * @param treeID
 * @param answerID
 */
export const unlink = async (
    treeID: number,
    answerID: number
): Promise<void> => {
    const answer = await nodeDAO.findByID(treeID, answerID);

    if (!answer) throw new NotFoundException("Answer does not exist");

    for (const child of answer.children) {
        await nodeDAO.unlink(answerID, child.id);
    }
};
