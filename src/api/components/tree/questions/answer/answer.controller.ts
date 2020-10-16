import { CreateAnswerDTO } from "./dto/create-answer.dto";
import * as contentDAO from "../../../content/content.dao";
import * as answerDAO from "./answer.dao";
import * as nodeDAO from "../../../node/node.dao";
import { Content, ContentType } from "../../../content/content.model";
import { Node } from "../../../node/node.model";
import { UpdateAnswerDTO } from "./dto/update-answer.dto";
import { UpdateContentDTO } from "../../../content/dto/update-content.dto";
import { Answer } from "./answer.model";

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

export const findByID = async (id: number): Promise<Content> => {
    const answer: Content = await contentDAO.findByID(id);
    return answer;
};

export const create = async (
    treeID: number,
    questionID: number,
    createAnswerDTO: CreateAnswerDTO
): Promise<Content> => {
    const id: number = await contentDAO.create(treeID, createAnswerDTO);
    const questionNode: Node = await nodeDAO.findByContentID(questionID);
    const answer: Content = await contentDAO.findByID(id);
    await nodeDAO.create({
        parent: questionNode.id,
        content: id,
    });

    if (createAnswerDTO.link) answer.link(createAnswerDTO.link);

    return answer;
};

export const remove = async (id: number): Promise<void> => {
    await contentDAO.findByID(id);
    await contentDAO.remove(id);
};

export const update = async (
    questionID: number,
    answerID: number,
    updateAnswerDTO: UpdateAnswerDTO
): Promise<void> => {
    await contentDAO.update(answerID, updateAnswerDTO);

    if (updateAnswerDTO.link) {
        const node: Node = await nodeDAO.findByContentID(questionID);
        const content: Content = await contentDAO.findByID(node.content);
        content.link(updateAnswerDTO.link);
    }
};
