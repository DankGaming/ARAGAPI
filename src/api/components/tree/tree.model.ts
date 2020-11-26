import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { GraphNode } from "../content/graph-node.model";
import { Employee } from "../employee/employee.model";
import { Node } from "../node/node.model";

@Entity()
export class Tree {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne((type) => Node, (node) => node.id)
    rootNode: GraphNode | number;

    @ManyToOne((type) => Employee, (employee) => employee.trees)
    creator: Employee | number;

    @Column()
    publishedTree: number;

    @Column()
    published: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
