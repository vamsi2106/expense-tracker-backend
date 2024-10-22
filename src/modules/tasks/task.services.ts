// import { Injectable } from "@nestjs/common";
// import * as cron from 'node-cron';
// import { ExpenseDao } from "src/database/mssql/dao/expenses.dao";
// import { RecurringExpenseDao } from "src/database/mssql/dao/recurringExpenses.dao";
// import { RecurringTask } from "src/database/mssql/models/recurringExpenses.models";
// import { CreateExpenseDto, TransactionType } from 'src/modules/expenses/dto/create-expense.dto'; // Assuming you have a CreateExpenseDto defined

// @Injectable()
// export class TaskService {
//     constructor(
//         private readonly expenseDao: ExpenseDao, // Correct dependency injection
//         private readonly recurringTaskDao : RecurringExpenseDao
//     ) 
//     {
//         this.scheduleTask();
//     }

//     // Task function that runs every minute
//     async performance() {
//         console.log('Task executed at:', new Date().toISOString());
//         try {
//             console.log('Task performed successfully');

//             // Example data to be inserted into the database
//             const data: CreateExpenseDto = {
//                 amount: 10000,
//                 name: "Kukke, Darmasthala",
//                 category: "Transport charge",
//                 transaction_type: TransactionType.EXPENSE,
//                 currency: "INR",
//                 description: "It is for testing purposes",
//                 date: new Date() // Date field should be of type 'Date'
//             };

//             // Make sure to await the expenseDao operation
//             await this.expenseDao.createExpense(data, '506a0bc1-5ce9-40ec-a30c-cf0659e0c52f');
//             let dataOut = await this.recurringTaskDao.getAllActiveTasks();
//             console.log(dataOut);
//         } catch (error) {
//             console.error('Error while performing the task:', error);
//         }
//     }

//     // Cron scheduler to trigger the task every minute
//     scheduleTask() {
//         cron.schedule('*/1 * * * *', async () => {
//             await this.performance();
//         });
//         console.log('Task scheduled to run every minute');
//     }
// }


import { Injectable } from "@nestjs/common";
import * as cron from 'node-cron';
import { ExpenseDao } from "src/database/mssql/dao/expenses.dao";
import { RecurringExpenseDao } from "src/database/mssql/dao/recurringExpenses.dao";
import { CreateExpenseDto, TransactionType } from 'src/modules/expenses/dto/create-expense.dto';

@Injectable()
export class TaskService {
    constructor(
        private readonly expenseDao: ExpenseDao,
        private readonly recurringExpensesDao: RecurringExpenseDao
    ) {
        this.scheduleTask();
    }

    // Task function that runs every minute
    async performance() {
        console.log('Task executed at:', new Date().toISOString());
        try {
            // Fetch active recurring tasks
            const activeTasks = await this.recurringExpensesDao.getAllActiveTasks();
            for (const task of activeTasks) {
                // Process each recurring task
                await this.processTask(task);
            }
        } catch (error) {
            console.error('Error while performing the task:', error);
        }
    }

    private async processTask(task) {
        const currentDate = new Date();
        
        // Check if the task is active and if it should execute
        if (task.is_active && this.shouldExecuteTask(task, currentDate)) {
            // Create the expense object from the task
            const expenseData: CreateExpenseDto = {
                amount: task.amount,
                name: task.name,
                category: task.category_id, // Ensure this field matches the expected input
                transaction_type: task.transaction_type === 'income' ? TransactionType.INCOME : TransactionType.EXPENSE,
                currency: task.currency,
                description: task.description,
                date: currentDate, // Set to the current date for the new expense
            };

            // Insert the expense into the expenses table
            await this.expenseDao.createExpense(expenseData, task.user_id); // Using user_id from task
            
            // No need to manually update 'updatedAt'; it should be automatically updated by the database
            await this.recurringExpensesDao.updateTaskData({}, task.id);

            // Check if the task has reached its end date and deactivate if necessary
            if (task.end_date && currentDate > new Date(task.end_date)) {
                await this.recurringExpensesDao.updateTaskData({ is_active: false }, task.id);
            }
        }
    }

    private shouldExecuteTask(task, currentDate: Date): boolean {
        // Calculate the next execution date based on the task's interval
        const lastExecutionDate = task.updatedAt || task.start_date; // Use updatedAt or start_date if not available
        const interval = task.interval;

        let nextExecutionDate: Date;
        switch (interval) {
            case 'daily':
                nextExecutionDate = new Date(lastExecutionDate);
                nextExecutionDate.setDate(nextExecutionDate.getDate() + 1);
                break;
            case 'weekly':
                nextExecutionDate = new Date(lastExecutionDate);
                nextExecutionDate.setDate(nextExecutionDate.getDate() + 7);
                break;
            case 'monthly':
                nextExecutionDate = new Date(lastExecutionDate);
                nextExecutionDate.setMonth(nextExecutionDate.getMonth() + 1);
                break;
            case 'yearly':
                nextExecutionDate = new Date(lastExecutionDate);
                nextExecutionDate.setFullYear(nextExecutionDate.getFullYear() + 1);
                break;
            default:
                return false; // If the interval is not recognized, don't execute
        }

        return currentDate >= nextExecutionDate; // Execute if the current date is past the next execution date
    }

    // Cron scheduler to trigger the task every minute
    scheduleTask() {
        cron.schedule('*/1 * * * *', async () => {
            await this.performance();
        });
        console.log('Task scheduled to run every minute');
    }
}
