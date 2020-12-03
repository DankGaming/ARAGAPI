import { Answer } from "./answer/answer.model";
import { CreateAnswerDTO } from "./answer/dto/create-answer.dto";
import * as contentDAO from "../../content/content.dao";
import * as nodeDAO from "../node/node.dao";
import * as answerController from "./answer/answer.controller";
import * as treeDAO from "../tree.dao";
import * as questionDAO from "./question.dao";
import * as questionInfoDAO from "../questions/question-info/question-info.dao";
import { Content, ContentType } from "../../content/content.model";
import { UpdateContentDTO } from "../../content/dto/update-content.dto";
import { CreateQuestionDTO } from "./dto/create-question.dto";
import { UpdateQuestionDTO } from "./dto/update-question.dto";
import database from "../../../../utils/database";
import { getRepository, SelectQueryBuilder, UpdateResult } from "typeorm";
import { Node } from "../node/node.model";
import { QuestionInfo } from "./question-info/question-info.model";
import { FilterNodeDTO } from "../node/dto/filter-node.dto";

export const findAll = async (
    treeID: number,
    filter: FilterNodeDTO
): Promise<Node[]> => {
    filter.type = ContentType.QUESTION;
    return await nodeDAO.findAll(treeID, filter);
};

export const create = async (
    treeID: number,
    dto: CreateQuestionDTO
): Promise<Node> => {
    const question: Node = await nodeDAO.create(treeID, dto);
    await questionInfoDAO.create(question.id, dto.questionInfo);

    if (dto.answers) {
        for (const createAnswerDTO of dto.answers) {
            await answerController.create(treeID, question.id, createAnswerDTO);
        }
    }
    if (dto.root) await treeDAO.update(treeID, { root: question.id });

    const newQuestion = await nodeDAO.findByID(treeID, question.id);
    return newQuestion!;
};

export const update = async (
    treeID: number,
    questionID: number,
    dto: UpdateQuestionDTO
): Promise<Node> => {
    const question: Node = await nodeDAO.update(treeID, questionID, dto);

    if (dto.root) {
        await treeDAO.update(treeID, { root: questionID });
    }

    return question;
};
