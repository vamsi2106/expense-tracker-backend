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
          if (!value) return true;
          
          const inputDate = new Date(value);
          if (isNaN(inputDate.getTime())) return false; // Invalid date
          
          const today = new Date();
          
          // Compare only dates, not times
          const inputDateOnly = new Date(
            inputDate.getFullYear(),
            inputDate.getMonth(),
            inputDate.getDate()
          );
          
          const todayOnly = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );
          
          return inputDateOnly >= todayOnly;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not be in the past`;
        },
      },
    });
  };
}