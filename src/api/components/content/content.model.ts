import { Node } from "../tree/node/node.model";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

export enum ContentType {
    QUESTION = "QUESTION",
    ANSWER = "ANSWER",
    NOTIFICATION = "NOTIFICATION",
}

@Entity()
export class Content {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({
        type: "enum",
        enum: ContentType,
    })
    type: ContentType;

    @Column("integer")
    tree: number;

    @OneToOne((type) => Node, (node) => node.content)
    node?: Node;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
