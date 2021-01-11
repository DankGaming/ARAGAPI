import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ForeignKeyConstraint } from "../../../../utils/foreign-key-constraint";
import { QuestionInfo } from "../../tree/questions/question-info/question-info.model";
import { Tree } from "../../tree/tree.model";
import { ContentType } from "./content-type";

@Entity()
export class Node {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("longtext")
    content: string;

    @Column({
        type: "enum",
        enum: ContentType,
    })
    type: ContentType;

    @ManyToOne((type) => Tree, (tree) => tree.nodes, {
        nullable: false,
        onUpdate: ForeignKeyConstraint.CASCADE,
        onDelete: ForeignKeyConstraint.CASCADE,
    })
    tree: Tree;

    @ManyToMany((type) => Node, (node) => node.id, { cascade: true })
    @JoinTable({
        name: "node_child",
        joinColumn: {
            name: "node",
        },
        inverseJoinColumn: {
            name: "child",
        },
    })
    children: Node[];

    @OneToOne((type) => QuestionInfo, (info) => info.question)
    questionInfo?: QuestionInfo;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
