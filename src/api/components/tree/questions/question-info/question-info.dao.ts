import { getRepository, Repository, SelectQueryBuilder } from "typeorm";
import { NotFoundException } from "../../../../../exceptions/NotFoundException";
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

export const copy = async (
    questionInfoID: number,
    newQuestionID: number
): Promise<QuestionInfo> => {
    const questionInfoRepository: Repository<QuestionInfo> = getRepository(
        QuestionInfo
    );
    const builder: SelectQueryBuilder<QuestionInfo> = questionInfoRepository.createQueryBuilder(
        "info"
    );
    builder.where("info.id = :id", { id: questionInfoID });

    const info = await builder.getOne();

    if (!info) throw new NotFoundException("Node does not exist");

    let newInfo: Partial<QuestionInfo> = { ...info };
    delete newInfo.id;
    newInfo.question = { id: newQuestionID } as Node;

    const savedInfo = await questionInfoRepository.save(newInfo);

    return savedInfo;
};
