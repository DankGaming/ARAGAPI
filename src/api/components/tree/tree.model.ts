import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ForeignKeyConstraint } from "../../../utils/foreign-key-constraint";
import { GraphNode } from "../content/graph-node.model";
import { Employee } from "../employee/employee.model";
import { Node } from "./node/node.model";

@Entity()
export class Tree {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne((type) => Node, (node) => node.id, {
        onUpdate: ForeignKeyConstraint.CASCADE,
        onDelete: ForeignKeyConstraint.SET_NULL,
    })
    @JoinColumn()
    root: Node;

    @ManyToOne((type) => Employee, (employee) => employee.trees, {
        nullable: false,
    })
    creator: Employee;

    @OneToOne((type) => Tree, (tree) => tree.id, {
        onUpdate: ForeignKeyConstraint.CASCADE,
        onDelete: ForeignKeyConstraint.SET_NULL,
    })
    @JoinColumn()
    concept: Tree;

    @OneToOne((type) => Tree, (tree) => tree.id, {
        onUpdate: ForeignKeyConstraint.CASCADE,
        onDelete: ForeignKeyConstraint.SET_NULL,
    })
    @JoinColumn()
    published: Tree;

    @OneToMany((type) => Node, (node) => node.tree)
    nodes: Node[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
