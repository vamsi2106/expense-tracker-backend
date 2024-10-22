//import { User } from "src/entities/user.entity";
import { CategoryDao } from '../dao/category.dao';
import { ExpenseDao } from '../dao/expenses.dao';
import { ExpenseTagDao } from '../dao/expenseTags.dao';
import { FileDao } from '../dao/file.dao';
import { RecurringExpenseDao } from '../dao/recurringExpenses.dao';
import { UserDao } from '../dao/user.dao';
import { Category } from '../models/category.models';
import { Expense } from '../models/expenses.models';
import { ExpenseTag } from '../models/expenseTags.models';
import { File } from '../models/file.models';
import { RecurringTask } from '../models/recurringExpenses.models';
import { User } from '../models/user.model';

export const SchemasList = [Expense,User,File,Category,ExpenseTag,RecurringTask];
export const DaoList = [UserDao,ExpenseDao,FileDao,CategoryDao,ExpenseTagDao, RecurringExpenseDao] 