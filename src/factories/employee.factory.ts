import { define } from "typeorm-seeding";
import { Employee, Role } from "../api/components/employee/employee.model";

define(Employee, (faker) => {
    const employee = new Employee();
    employee.firstname = faker.name.firstName();
    employee.lastname = faker.name.lastName();
    employee.email = faker.internet.email();
    employee.role = Role.STANDARD;
    employee.password = faker.internet.password();
    return employee;
});
