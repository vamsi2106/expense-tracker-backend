import { Injectable } from '@nestjs/common';
import { AbstractCategoryDao } from './mssql/abstract/categoryDao.abstract';
import { AbstractExpenseDao } from './mssql/abstract/expenseDao.abstract';
import { AbstractExpenseTagDao } from './mssql/abstract/expenseTagDao.abstract';
import { AbstractFileDao } from './mssql/abstract/fileDao.abstract';
import { AbstractRecurringExpenseDao } from './mssql/abstract/recurringExpenseDao.abstract';
import { AbstractUserDao } from './mssql/abstract/userDao.abstract';

@Injectable()
export class DatabaseService {
    constructor(
        public userSqlTxn:AbstractUserDao,
        public expenseSqlTxn:AbstractExpenseDao,
        public fileSqlTxn:AbstractFileDao,
        public expenseTagSqlTxn : AbstractExpenseTagDao,
        public recurringExpenseSqlTxn : AbstractRecurringExpenseDao,
        public categorySqlTxn : AbstractCategoryDao
    ){}
}

