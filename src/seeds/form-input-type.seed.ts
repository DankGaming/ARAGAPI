import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { FormInputType } from "../api/components/form-input-type/form-input-type.model";

export default class FormInputTypeSeeder implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await connection
            .createQueryBuilder()
            .insert()
            .into(FormInputType)
            .values([
                {
                    name: "TEXT",
                    friendlyName: "Tekstveld",
                },
                {
                    name: "FILE",
                    friendlyName: "Bestandveld",
                },
            ])
            .execute();
    }
}
