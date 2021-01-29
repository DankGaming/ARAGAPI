import { Form } from "./form.model";
import * as formDAO from "./form.dao";
import * as nodeDAO from "../tree/node/node.dao";
import { NotFoundException } from "../../../exceptions/NotFoundException";
import { Filter } from "../../../utils/filter";
import { CreateFormDTO } from "./dto/create-form.dto";
import { UpdateFormDTO } from "./dto/update-form.dto";
import { SubmitFormDTO } from "./dto/submit-form.dto";
import { InputTypeFactory } from "../form-input-type/types/input-type-factory";
import { BadRequestException } from "../../../exceptions/BadRequestException";
import { EmailDTO } from "./dto/email.dto";
import { EmailAttachment, EmailService } from "../../../services/email-service";
require("dotenv").config();
import {
    createTestAccount,
    getTestMessageUrl,
    SentMessageInfo,
} from "nodemailer";
import { EmailOptions } from "../../../services/email-service";
import { InternalServerException } from "../../../exceptions/InternalServerException";
import { DeleteResult } from "typeorm";

export const findAll = async (filter: Filter): Promise<Form[]> => {
    return await formDAO.findAll(filter);
};

export const findByID = async (formID: number): Promise<Form> => {
    const form = await formDAO.findByID(formID);

    if (!form) throw new NotFoundException("Form does not exist");

    return form;
};

export const create = async (dto: CreateFormDTO): Promise<Form> => {
    return await formDAO.create(dto);
};

export const update = async (
    formID: number,
    dto: UpdateFormDTO
): Promise<Form> => {
    const form = await formDAO.findByID(formID);

    if (!form) throw new NotFoundException("Form does not exist");

    return await formDAO.update(formID, dto);
};

export const remove = async (formID: number): Promise<void> => {
    const form = await formDAO.findByID(formID);

    if (!form) throw new NotFoundException("Form does not exist");

    const result: DeleteResult = await formDAO.remove(formID);

    if (result.affected === 0)
        throw new BadRequestException("Can't delete form");
};

export const submit = async (
    formID: number,
    dto: SubmitFormDTO
): Promise<void> => {
    const form: Form = (await formDAO.findByID(formID))!;
    const response = parseForm(form, dto);

    // Generate and send email to configurable email address

    const emailDTO: EmailDTO = {
        answers: dto.answers,
        form,
        formData: response,
        date: new Date(),
    };

    const subject = `Meldingsformulier ${form.id}: ${form.name}`;
    const body = await generateEmail(emailDTO);

    const attachments: EmailAttachment[] = Object.keys(dto.attachments).map(
        (key: string): EmailAttachment => {
            return {
                filename: dto.attachments[key].name,
                path: dto.attachments[key].path,
            };
        }
    );

    const info: SentMessageInfo = await sendEmail(subject, body, attachments);
    // console.log(getTestMessageUrl(info));
};

const parseForm = (form: Form, dto: SubmitFormDTO): { [key: string]: any } => {
    const response: { [key: string]: any } = {};

    for (const input of Object.values(form.inputs)) {
        const value = dto.form[input.name];
        if (!input.type) throw new BadRequestException();
        const cls = InputTypeFactory.create(input.type.name);

        try {
            response[input.name] = cls.parse(value);
        } catch (err) {
            throw new BadRequestException();
        }
    }

    return response;
};

const generateEmail = async (dto: EmailDTO): Promise<string> => {
    let formAnswers = ``;
    let treeAnswers = ``;

    for (const key of Object.keys(dto.formData)) {
        formAnswers += `${key}: ${dto.formData[key]} \n`;
    }

    for (const key of Object.keys(dto.answers)) {
        if (!Number.isNaN(key))
            throw new BadRequestException("Number is not a number");
        const answer = await nodeDAO.findByIDWithoutTree(+dto.answers[+key]);
        const question = await nodeDAO.findByIDWithoutTree(+key);

        if (!answer || !question) throw new BadRequestException("Not found");

        treeAnswers += `${question.content}: ${answer.content} \n`;
    }

    return formAnswers + "---\n" + treeAnswers;
};

const sendEmail = async (
    subject: string,
    body: string,
    attachments: EmailAttachment[]
): Promise<SentMessageInfo> => {
    const testAccount = await createTestAccount();

    const host = process.env.EMAIL_HOST || "smtp.ethereal.email";
    const port = +(process.env.EMAIL_PORT || 587);
    const secure = !process.env.EMAIL_SECURE;
    const user = process.env.EMAIL_USER || testAccount.user;
    const pass = process.env.EMAIL_PASSWORD || testAccount.pass;
    const from = process.env.EMAIL_FROM;
    const to = process.env.EMAIL_TO;

    if (!from || !to)
        throw new InternalServerException("ENV variables are not defined");

    const emailService = new EmailService(host, port, { user, pass }, secure);

    const options: EmailOptions = {
        from: `${from} <${from}>`,
        to,
        subject,
        text: body,
        html: body,
        attachments,
    };

    emailService.create(options);
    return await emailService.send();
};
