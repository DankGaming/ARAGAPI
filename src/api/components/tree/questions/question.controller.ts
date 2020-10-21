import { Answer } from "./answer/answer.model";
import { CreateAnswerDTO } from "./answer/dto/create-answer.dto";
import * as contentDAO from "../../content/content.dao";
import * as nodeDAO from "../../node/node.dao";
import * as answerController from "./answer/answer.controller";
import * as treeDAO from "../tree.dao";
import { Content, ContentType } from "../../content/content.model";
import { UpdateContentDTO } from "../../content/dto/update-content.dto";
import { CreateQuestionDTO } from "./dto/create-question.dto";
import { Question } from "./question.model";
import { CreateNodeDTO } from "../../node/dto/create-node.dto";
import { UpdateQuestionDTO } from "./dto/update-question.dto";
import database from "../../../../utils/database";
import { Node } from "../../node/node.model";

export const findAll = async (): Promise<Content[]> => {
    const content: Content[] = await contentDAO.findAll({
        type: ContentType.QUESTION,
    });
    return content;
};

export const findAllByTree = async (tree: number): Promise<Content[]> => {
    const questions: Content[] = await contentDAO.findAll({
        tree,
        type: ContentType.QUESTION,
    });

    return questions;
};

export const findByID = async (id: number): Promise<Content> => {
    const content: Content = await contentDAO.findByID(id);
    return content;
};

export const create = async (
    treeID: number,
    createQuestionDTO: CreateQuestionDTO
): Promise<Question> => {
    const id: number = await contentDAO.create(treeID, createQuestionDTO);
    const nodeID = await nodeDAO.create({ content: id });

    const answers: Promise<Answer>[] = [];

    const createAnswer = async (
        createAnswerDTO: CreateAnswerDTO
    ): Promise<Answer> => {
        const answer: Content = await answerController.create(
            treeID,
            id,
            createAnswerDTO
        );
        return answer as Answer;
    };

    if (createQuestionDTO.answers) {
        createQuestionDTO.answers.forEach(
            (createAnswerDTO: CreateAnswerDTO) => {
                answers.push(createAnswer(createAnswerDTO));
            }
        );
    }

    if (createQuestionDTO.root) {
        await treeDAO.update(treeID, { rootNode: nodeID });
    }

    const question: Question = (await contentDAO.findByID(id)) as Question;
    question.answers = await Promise.all(answers);

    if (createQuestionDTO.link) question.link(createQuestionDTO.link);

    return question;
};

export const remove = async (id: number): Promise<void> => {
    await contentDAO.findByID(id);
    return contentDAO.remove(id);
};

export const update = async (
    id: number,
    treeID: number,
    updateQuestionDTO: UpdateQuestionDTO
): Promise<void> => {
    await contentDAO.findByID(id);
    await contentDAO.update(id, updateQuestionDTO);

    if (updateQuestionDTO.root) {
        const node: Node = await nodeDAO.findByContentID(id);
        await treeDAO.update(treeID, { rootNode: node.id });
    }
};
