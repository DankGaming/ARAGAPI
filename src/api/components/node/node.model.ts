import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Content } from "../content/content.model";

@Entity()
export class Node {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("integer")
    parent: number;

    @OneToOne((type) => Content, (content) => content.node)
    content: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
