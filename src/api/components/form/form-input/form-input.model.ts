import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { FormInputType } from "../../form-input-type/form-input-type.model";
import { Form } from "../form.model";

@Entity()
export class FormInput {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("longtext", { nullable: true })
    description?: string;

    @ManyToOne((type) => Form, (form) => form.inputs)
    form: Form;

    @ManyToOne((type) => FormInputType, (type) => type.inputs)
    type: FormInputType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
