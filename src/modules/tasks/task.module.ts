import {Module} from "@nestjs/common";
import { TaskService } from "./task.services";
import { ExpenseDao } from "src/database/mssql/dao/expenses.dao";
import { CategoryDao } from "src/database/mssql/dao/category.dao";
import { SequelizeModule } from "@nestjs/sequelize";
import { Expense } from "src/database/mssql/models/expenses.models";
import { Category } from "src/database/mssql/models/category.models";
import { RecurringExpenseDao } from "src/database/mssql/dao/recurringExpenses.dao";
import { RecurringTask } from "src/database/mssql/models/recurringExpenses.models";

@Module({
    imports : [SequelizeModule.forFeature([Expense,Category,RecurringTask])],
    providers : [TaskService,ExpenseDao,CategoryDao,RecurringExpenseDao]
})
export class TaskManager{}