import { getRepository } from "typeorm";
import { Node } from "../../node/node.model";
import { CreateQuestionInfoDTO } from "./dto/create-question-info.dto";
import { QuestionInfo } from "./question-info.model";

export const create = async (
    questionID: number,
    dto: CreateQuestionInfoDTO
): Promise<QuestionInfo> => {
    const info = new QuestionInfo();
    info.question = { id: questionID } as Node;
    info.type = dto.type;

    return getRepository(QuestionInfo).save(info);
};
