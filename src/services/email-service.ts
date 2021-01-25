import { Transporter, SentMessageInfo, createTransport } from "nodemailer";

export interface EmailAuth {
    user: string;
    pass: string;
}

export interface EmailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
    attachments?: EmailAttachment[];
}

export interface EmailAttachment {
    filename?: string;
    content?: any;
    encoding?: string;
    raw?: string;
    href?: string;
    httpHeaders?: string;
    path?: string;
    contentType?: string;
}

export class EmailService {
    private transporter: Transporter;
    private options: EmailOptions;

    constructor(
        host: string,
        port: number,
        auth: EmailAuth,
        secure: boolean = true
    ) {
        this.transporter = createTransport({
            host,
            port,
            auth,
            secure,
        });
    }

    create(options: EmailOptions): void {
        this.options = options;
    }

    async send(): Promise<SentMessageInfo> {
        try {
            return await this.transporter.sendMail(this.options);
        } catch (err) {
            console.log(err);
        }
    }
}
