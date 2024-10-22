import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DbModule } from "src/database/database.module";
import { RecurringTask } from "src/database/mssql/models/recurringExpenses.models";
import { RecurringExpenseController } from "./recurringExpenses.controller";
import { RecurringTaskServices } from "./recurringExpenses.service";
import { RecurringExpenseDao } from "src/database/mssql/dao/recurringExpenses.dao";

@Module({
    imports : [SequelizeModule.forFeature([RecurringTask]),DbModule],
    controllers : [RecurringExpenseController],
    providers : [RecurringTaskServices, RecurringExpenseDao]
})
export class RecurringTaskModule {}