//import { User } from "src/entities/user.entity";
import { AbstractCategoryDao } from '../abstract/categoryDao.abstract';
import { AbstractExpenseDao } from '../abstract/expenseDao.abstract';
import { AbstractExpenseTagDao } from '../abstract/expenseTagDao.abstract';
import { AbstractFileDao } from '../abstract/fileDao.abstract';
import { AbstractRecurringExpenseDao } from '../abstract/recurringExpenseDao.abstract';
import { AbstractUserDao } from '../abstract/userDao.abstract';
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

export const SchemasList = [Expense, User, File, Category, ExpenseTag, RecurringTask];
export const ProviderDaoList = [
  { provide: AbstractUserDao, useClass: UserDao },
  { provide: AbstractExpenseDao, useClass: ExpenseDao },
  { provide: AbstractFileDao, useClass: FileDao },
  { provide: AbstractCategoryDao, useClass: CategoryDao},
  { provide: AbstractExpenseTagDao, useClass: ExpenseTagDao},
  { provide: AbstractRecurringExpenseDao, useClass: RecurringExpenseDao}
]

// export const DaoList = [ExpenseDao, ExpenseTagDao, CategoryDao, UserDao, RecurringExpenseDao, FileDao];