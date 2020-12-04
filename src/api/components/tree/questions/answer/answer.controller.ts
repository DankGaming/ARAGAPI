import { CreateAnswerDTO } from "./dto/create-answer.dto";
import * as nodeDAO from "../../node/node.dao";
import * as nodeController from "../../node/node.controller";
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
    await nodeController.link(treeID, questionID, answer.id);

    /**
     * Link answer to another node if specified in DTO
     */
    if (dto.next) await nodeController.link(treeID, answer.id, dto.next);

    return answer;
};

export const update = async (
    treeID: number,
    answerID: number,
    dto: UpdateAnswerDTO
): Promise<void> => {
    await nodeDAO.update(treeID, answerID, dto);

    if (dto.next) await nodeController.link(treeID, answerID, dto.next);
};

export const findAnswersOfQuestion = async (
    treeID: number,
    questionID: number
): Promise<Node[]> => {
    const question = (await nodeDAO.findByID(treeID, questionID))!;
    return question.children;
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

    for (const child of answer.children)
        await nodeDAO.unlink(answerID, child.id);
};
