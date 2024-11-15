import { Category } from "../models/category.models";
import { Expense } from "../models/expenses.models";
import { ExpenseTag } from "../models/expenseTags.models";
import { File } from "../models/file.models";
import { RecurringTask } from "../models/recurringExpenses.models";
import { User } from "../models/user.model";
import { msSqlConstants } from "./constants.mssql";

const mssqlModalProvider = [
    {
        provide : msSqlConstants.Expense,
        useValue : Expense
    },
    {
        provide : msSqlConstants.User,
        useValue : User
    },
    {
        provide : msSqlConstants.File,
        useValue : File
    },
    {
        provide : msSqlConstants.Category,
        useValue : Category
    },
    {
        provide : msSqlConstants.ExpenseTag,
        useValue : ExpenseTag
    },
    {
        provide : msSqlConstants.RecurrinTask,
        useValue : RecurringTask
    }
]

const models = mssqlModalProvider.map((provider)=>provider.useValue);
export {models, mssqlModalProvider};