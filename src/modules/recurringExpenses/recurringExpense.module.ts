import { Module } from "@nestjs/common";
import { ScheduleModule } from '@nestjs/schedule';
import { RecurringExpenseController } from "./recurringExpenses.controller";
import { RecurringTaskServices } from "./recurringExpenses.service";
import { AbstractRecurringExpense } from "./recurringExpense.abstract";

@Module({
    imports: [
         ScheduleModule.forRoot(),
    ],
    controllers: [RecurringExpenseController],
    providers: [
        {
            provide: AbstractRecurringExpense,
            useClass: RecurringTaskServices
        }
    ]
})
export class RecurringTaskModule { }