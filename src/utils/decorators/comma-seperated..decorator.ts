import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";

export function CommaSeperatedEnum(
    property: Object,
    validationOptions?: ValidationOptions
) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: CommaSeperatedEnumConstraint,
        });
    };
}

@ValidatorConstraint({ name: "CommaSeperatedEnum" })
export class CommaSeperatedEnumConstraint
    implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments): boolean {
        const directions: string[] = value.split(",");

        for (let direction of directions) {
            const [relatedPropertyName] = args.constraints;
            const values = Object.values(relatedPropertyName);
            if (!values.includes(direction)) return false;
        }

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const values = Object.values(relatedPropertyName);
        return `$property must match ${values} exactly`;
    }
}
