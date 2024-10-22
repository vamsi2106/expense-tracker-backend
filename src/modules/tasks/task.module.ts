import {Module} from "@nestjs/common";
import { TaskService } from "./task.services";
import { ExpenseDao } from "src/database/mssql/dao/expenses.dao";
import { CategoryDao } from "src/database/mssql/dao/category.dao";
import { SequelizeModule } from "@nestjs/sequelize";
import { Expense } from "src/database/mssql/models/expenses.models";
import { Category } from "src/database/mssql/models/category.models";

@Module({
    imports : [SequelizeModule.forFeature([Expense,Category])],
    providers : [TaskService,ExpenseDao,CategoryDao]
})
export class TaskManager{}