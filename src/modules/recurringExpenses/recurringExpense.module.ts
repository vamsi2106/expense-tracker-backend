// import { Module } from "@nestjs/common";
// import { SequelizeModule } from "@nestjs/sequelize";
// import { DbModule } from "src/database/database.module";
// import { RecurringTask } from "src/database/mssql/models/recurringExpenses.models";
// import { RecurringExpenseController } from "./recurringExpenses.controller";
// import { RecurringTaskServices } from "./recurringExpenses.service";
// import { RecurringExpenseDao } from "src/database/mssql/dao/recurringExpenses.dao";
// import { Expense } from "src/database/mssql/models/expenses.models";

// @Module({
//     imports : [SequelizeModule.forFeature([Expense, RecurringTask]),DbModule],
//     controllers : [RecurringExpenseController],
//     providers : [RecurringTaskServices, RecurringExpenseDao]
// })
// export class RecurringTaskModule {}

import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ScheduleModule } from '@nestjs/schedule';
import { DbModule } from "src/database/database.module";
import { RecurringTask } from "src/database/mssql/models/recurringExpenses.models";
import { RecurringExpenseController } from "./recurringExpenses.controller";
import { RecurringTaskServices } from "./recurringExpenses.service";
import { RecurringExpenseDao } from "src/database/mssql/dao/recurringExpenses.dao";
import { Expense } from "src/database/mssql/models/expenses.models";

@Module({
    imports: [
        SequelizeModule.forFeature([Expense, RecurringTask]),
        ScheduleModule.forRoot(),
        DbModule
    ],
    controllers: [RecurringExpenseController],
    providers: [RecurringTaskServices, RecurringExpenseDao]
})
export class RecurringTaskModule { }