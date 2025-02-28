import * as bcrypt from "bcryptjs";
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Tree } from "../tree/tree.model";

export enum Role {
    ADMIN = "ADMIN",
    STANDARD = "STANDARD",
}

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password?: string;

    @Column({
        type: "enum",
        enum: Role,
        default: Role.STANDARD,
    })
    role: Role;

    @OneToMany((type) => Tree, (tree) => tree.creator)
    trees: Tree[];

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @BeforeInsert()
    async setPassword() {
        this.password = await bcrypt.hash(this.password!, 10);
    }

    async checkPassword(password: string) {
        return await bcrypt.compare(password, this.password!);
    }
}
