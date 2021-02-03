import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { Employee, Role } from "../api/components/employee/employee.model";
import * as bcrypt from "bcryptjs";

export default class EmployeeSeeder implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await connection
            .createQueryBuilder()
            .insert()
            .into(Employee)
            .values([
                {
                    firstname: "admin",
                    lastname: "admin",
                    email: "admin@mail.com",
                    password: await bcrypt.hash("admin", 10),
                    role: Role.ADMIN,
                },
            ])
            .execute();
    }
}
