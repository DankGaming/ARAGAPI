import { ContentType } from "../content.model";

export class UpdateContentDTO {
    content?: string;
    type?: ContentType;
    tree?: number;
}
