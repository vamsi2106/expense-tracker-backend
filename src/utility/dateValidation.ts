import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsNotPastDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsNotPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // Skip validation if no value (to allow optional dates)
          const inputDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set time to the start of the current day
          return inputDate >= today; // Check if date is not in the past
        },
        defaultMessage(): string {
          return `${propertyName} should not be in the past.`;
        },
      },
    });
  };
}
