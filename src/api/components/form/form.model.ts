import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ForeignKeyConstraint } from "../../../utils/foreign-key-constraint";
import { FormInfo } from "../tree/node/form/form-info/form-info.model";
import { FormInput } from "./form-input/form-input.model";

@Entity()
export class Form {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("longtext", { nullable: true })
    description?: string;

    @OneToMany((type) => FormInfo, (info) => info.form)
    formInfos: FormInfo[];

    @OneToMany((type) => FormInput, (input) => input.form)
    inputs: FormInput[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
