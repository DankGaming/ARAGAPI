import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ForeignKeyConstraint } from "../../../../../../utils/foreign-key-constraint";
import { Form } from "../../../../form/form.model";
import { Node } from "../../node.model";

@Entity()
export class FormInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne((type) => Node, (node) => node.formInfo, {
        onUpdate: ForeignKeyConstraint.CASCADE,
        onDelete: ForeignKeyConstraint.CASCADE,
    })
    @JoinColumn()
    node: Node;

    @ManyToOne((type) => Form, (form) => form.formInfos)
    form: Form;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
