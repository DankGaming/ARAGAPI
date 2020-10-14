import * as contentDAO from "../content/content.dao";
import { Content, ContentType } from "../content/content.model";
import { UpdateContentDTO } from "../content/dto/update-content.dto";
import { CreateQuestionDTO } from "./dto/create-question.dto";
import { Question } from "./question.model";

export const findAll = async (): Promise<Content[]> => {
    const content: Content[] = await contentDAO.findAll({
        type: ContentType.QUESTION,
    });
    return content;
};

export const findAllByTree = async (tree: number): Promise<Content[]> => {
    const content: Content[] = await contentDAO.findAll({
        tree,
        type: ContentType.QUESTION,
    });
    return content;
};

export const findByID = async (id: number): Promise<Content> => {
    const content: Content = await contentDAO.findByID(id);
    return content;
};

export const create = async (
    createQuestionDTO: CreateQuestionDTO
): Promise<number> => {
    const id: number = await contentDAO.create(createQuestionDTO);
    return id;
};

export const remove = async (id: number): Promise<void> => {
    await contentDAO.findByID(id);
    return contentDAO.remove(id);
};

export const update = async (
    id: number,
    updateContentDTO: UpdateContentDTO
): Promise<Content> => {
    await contentDAO.findByID(id);
    await contentDAO.update(id, updateContentDTO);
    const content: Content = await contentDAO.findByID(id);
    return content;
};
