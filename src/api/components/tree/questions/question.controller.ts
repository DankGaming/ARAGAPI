import * as nodeDAO from "../node/node.dao";
import * as answerController from "./answer/answer.controller";
import * as treeDAO from "../tree.dao";
import * as questionInfoDAO from "../questions/question-info/question-info.dao";
import { Node } from "../node/node.model";
import { FilterNodeDTO } from "../node/dto/filter-node.dto";
import { ContentType } from "../node/content-type";
import { CreateQuestionDTO } from "./dto/create-question.dto";
import { UpdateQuestionDTO } from "./dto/update-question.dto";

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
    await questionInfoDAO.create(question.id, dto.info);

    if (dto.answers) {
        /* Create answers specified in the DTO */
        for (const createAnswerDTO of dto.answers) {
            await answerController.create(treeID, question.id, createAnswerDTO);
        }
    }

    /* Set question as root of tree if specified in DTO */
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

    if (dto.root) await treeDAO.update(treeID, { root: questionID });
    if (dto.info) await questionInfoDAO.update(questionID, dto.info);

    return question;
};
