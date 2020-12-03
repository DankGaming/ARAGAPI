import { CreateAnswerDTO } from "./dto/create-answer.dto";
import * as contentDAO from "../../../content/content.dao";
import * as answerDAO from "./answer.dao";
import * as nodeDAO from "../../node/node.dao";
import { Content, ContentType } from "../../../content/content.model";
import { Node } from "../../node/node.model";
import { UpdateAnswerDTO } from "./dto/update-answer.dto";
import { UpdateContentDTO } from "../../../content/dto/update-content.dto";
import { Answer } from "./answer.model";
import { NotFoundException } from "../../../../../exceptions/NotFoundException";
export const findAll = async (): Promise<Content[]> => {
    const answers: Content[] = await contentDAO.findAll({
        type: ContentType.ANSWER,
    });
    return answers;
};

export const findAllByTree = async (tree: number): Promise<Content[]> => {
    const content: Content[] = await contentDAO.findAll({
        tree,
        type: ContentType.ANSWER,
    });
    return content;
};

export const findAllByQuestion = async (
    questionID: number
): Promise<Content[]> => {
    const answers: Content[] = await answerDAO.findAllByQuestion(questionID);
    return answers;
};

export const create = async (
    treeID: number,
    questionID: number,
    dto: CreateAnswerDTO
): Promise<Node> => {
    const answer: Node = await nodeDAO.create(treeID, dto);
    await nodeDAO.link(questionID, answer.id);
    if (dto.next) nodeDAO.link(answer.id, dto.next);
    return answer;
};
