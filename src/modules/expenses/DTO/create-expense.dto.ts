export class CreateExpenseDto {
    readonly email: string;
    readonly amount: number;
    readonly date: Date;
    readonly name: string;
    readonly category: string;
  }
  