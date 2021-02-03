import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ForeignKeyConstraint } from "../../../../../utils/foreign-key-constraint";
import { Node } from "../../node/node.model";

export enum QuestionType {
    DROPDOWN = "DROPDOWN",
    RADIO = "RADIO",
}

@Entity()
export class QuestionInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne((type) => Node, (node) => node.questionInfo, {
        onUpdate: ForeignKeyConstraint.CASCADE,
        onDelete: ForeignKeyConstraint.CASCADE,
    })
    @JoinColumn()
    question: Node;

    @Column({
        type: "enum",
        enum: QuestionType,
    })
    type: QuestionType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
