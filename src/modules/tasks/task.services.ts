import { Injectable } from "@nestjs/common";
import * as cron from 'node-cron';
import { ExpenseDao } from "src/database/mssql/dao/expenses.dao";
import { CreateExpenseDto, TransactionType } from 'src/modules/expenses/dto/create-expense.dto'; // Assuming you have a CreateExpenseDto defined

@Injectable()
export class TaskService {
    constructor(
        private readonly expenseDao: ExpenseDao // Correct dependency injection
    ) {
        this.scheduleTask();
    }

    // Task function that runs every minute
    async performance() {
        console.log('Task executed at:', new Date().toISOString());
        try {
            console.log('Task performed successfully');

            // Example data to be inserted into the database
            const data: CreateExpenseDto = {
                amount: 10000,
                name: "Kukke, Darmasthala",
                category: "Transport charge",
                transaction_type: TransactionType.EXPENSE,
                currency: "INR",
                description: "It is for testing purposes",
                date: new Date() // Date field should be of type 'Date'
            };

            // Make sure to await the expenseDao operation
            await this.expenseDao.createExpense(data, '506a0bc1-5ce9-40ec-a30c-cf0659e0c52f');

        } catch (error) {
            console.error('Error while performing the task:', error);
        }
    }

    // Cron scheduler to trigger the task every minute
    scheduleTask() {
        cron.schedule('*/1 * * * *', async () => {
            await this.performance();
        });
        console.log('Task scheduled to run every minute');
    }
}
