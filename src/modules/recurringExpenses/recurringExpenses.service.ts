// import { Injectable } from "@nestjs/common";
// import { RecurringExpenseDao } from "src/database/mssql/dao/recurringExpenses.dao";
// import { CreateRecurringTaskDto } from "./DTO/createRecurringExpense.dto";
// import { UpdateRecurringTaskDto } from "./DTO/updateRecurringExpense.dto";
// @Injectable()
// export class RecurringTaskServices {
//     constructor(private readonly recurringTaskDao: RecurringExpenseDao) { }

//     async createTask(taskDto: CreateRecurringTaskDto, userId:string,expenseId:string) {
//         return this.recurringTaskDao.createTask(taskDto,userId,expenseId)
//     }

//     async getAllTasks(userId:string){
//         return this.recurringTaskDao.getAllTasks(userId);
//     }

//     async getAllActiveTasks(){
//         return this.recurringTaskDao.getAllActiveTasks();
//     }

//     async deleteTask(id:string,userId:string){
//         return this.recurringTaskDao.deleteTask(id,userId);
//     }

//     async updateTask(updateTaskDto:UpdateRecurringTaskDto,id:string,userId:string){
//         return this.recurringTaskDao.updateTask(updateTaskDto,id,userId);
//     }

//     async getTaskById(id:string,userId:string){
//         return this.recurringTaskDao.getById(id,userId);
//     }

// }


// src/recurring-task/recurringExpenses.service.ts
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { RecurringExpenseDao } from "src/database/mssql/dao/recurringExpenses.dao";
import { CreateRecurringTaskDto, RecurringInterval } from "./DTO/createRecurringExpense.dto";
import { UpdateRecurringTaskDto } from "./DTO/updateRecurringExpense.dto";
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as moment from 'moment';
import { Interval } from "src/database/mssql/models/recurringExpenses.models";
import { InjectModel } from "@nestjs/sequelize";
import { Expense } from "src/database/mssql/models/expenses.models";
import { RecurringTask } from "src/database/mssql/models/recurringExpenses.models";
import { ResponseMessages } from "src/common/messages";

@Injectable()
export class RecurringTaskServices implements OnModuleInit {
    private readonly logger = new Logger(RecurringTaskServices.name);

    constructor(
        private readonly recurringTaskDao: RecurringExpenseDao,
        private schedulerRegistry: SchedulerRegistry,
        @InjectModel(Expense)
        private expenseModel: typeof Expense,
        @InjectModel(RecurringTask)
        private recurringTaskModel: typeof RecurringTask,
    ) {
        //this.initializeTasks();
    }

    async onModuleInit() {
        await this.initializeTasks();
    }

    private async initializeTasks() {
        const activeTasks = await this.getAllActiveTasks();
        if (activeTasks.status === 200 && activeTasks.response) {
            let currentDate = new Date();
            for (const task of activeTasks.response) {
                let start_date = new Date(task.start_date); 
                if (task.start_date <= currentDate) {
                    await this.scheduleTask(task);
                } else if (task.end_date && task.endDate >= currentDate) {
                    this.removeScheduledTask(task);
                }
            }
        }
    }

    async createTask(taskDto: CreateRecurringTaskDto, userId: string, expenseId: string) {
        try {
            const result = await this.recurringTaskDao.createTask(taskDto, userId, expenseId);

            if (result.status === 200 && result.response) {
                try {
                    await this.scheduleTask(result.response);
                } catch (scheduleError) {
                    console.error('Schedule Task Error:', scheduleError);
                    // Consider if you want to rollback the created task here
                }
            }

            return result;
        } catch (error) {
            console.error('Service Error:', error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message || ResponseMessages.UE,
                    error: 'Internal Server Error'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    async getAllTasks(userId: string) {
        return this.recurringTaskDao.getAllTasks(userId);
    }

    async getAllActiveTasks() {
        return this.recurringTaskDao.getAllActiveTasks();
    }

    async deleteTask(id: string, userId: string) {
        const result = await this.recurringTaskDao.deleteTask(id, userId);
        this.removeScheduledTask(id);
        return result;
    }

    async updateTask(updateTaskDto: UpdateRecurringTaskDto, id: string, userId: string) {
        const result = await this.recurringTaskDao.updateTask(updateTaskDto, id, userId);
        if (result.status === 200 && result.response) {
            this.removeScheduledTask(id);
            await this.scheduleTask(result.response);
        }
        return result;
    }

    async getTaskById(id: string, userId: string) {
        return this.recurringTaskDao.getById(id, userId);
    }

    private removeScheduledTask(taskId: string) {
        try {
            const jobName = `task_${taskId}`;
            this.schedulerRegistry.deleteCronJob(jobName);
        } catch (error) {
            this.logger.warn(`No scheduled task found for ID: ${taskId}`);
        }
    }

    private async scheduleTask(task: RecurringTask) {
        if (!task.is_active) {
            return;
        }

        const cronExpression = this.getCronExpression(task);
        const jobName = `task_${task.id}`;

        try {
            this.removeScheduledTask(task.id);
        } catch (err) {
            // Job doesn't exist yet
        }

        const job = new CronJob(cronExpression, () => {
            this.executeTask(task);
        });

        this.schedulerRegistry.addCronJob(jobName, job);
        job.start();

        this.logger.log(`Scheduled task ${jobName} with cron: ${cronExpression}`);
    }

    // private extractTimeFromDate(dateTimeString: string | Date): string {
    //     try {
    //       const date = new Date(dateTimeString);
    //       // Format to HH:mm
    //       const hours = date.getUTCHours().toString().padStart(2, '0');
    //       const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    //       return `${hours}:${minutes}`;
    //     } catch (error) {
    //       throw new BadRequestException('Invalid datetime format');
    //     }
    //   }

    private getCronExpression(task: any): string {
        try {
            console.log(task.time);
            // Ensure task.time is a string and has the correct format
            // if (!task.time || typeof task.time !== 'string') {
            //     throw new Error('Invalid time format');

            // }

            // const [hours, minutes, seconds] = task.time.split(':').map(Number);
            const date = new Date(task.time);
            // Format to HH:mm
            const hours = parseInt(date.getUTCHours().toString().padStart(2, '0'));
            const minutes = parseInt(date.getUTCMinutes().toString().padStart(2, '0'));
            const seconds = parseInt(date.getUTCSeconds().toString().padStart(2, '0'));
            // Validate time components
            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
                throw new Error('Invalid time components');
            }

            // Create cron expression based on interval
            switch (task.interval) {
                case RecurringInterval.MINUTE:
                    return `* * * * *`; //runs for every minute, if minute is specified then it will be exicuted at that particular minute at every hour
                case RecurringInterval.HOURLY:
                    return `0 * * * *`; //runs at the start of every hour
                case RecurringInterval.DAILY:
                    return `${minutes} ${hours} * * *`; // runs at specified hour and minute
                case RecurringInterval.WEEKLY:
                    return `${minutes} ${hours} * * 1`; // first of week (Monday)
                case RecurringInterval.MONTHLY:
                    return `${minutes} ${hours} 1 * *`; // 1st of month
                case RecurringInterval.YEARLY:
                    return `${minutes} ${hours} 1 1 *`; // January 1st
                default:
                    throw new Error(`Unsupported interval: ${task.interval}`);
            }
        } catch (error) {
            console.error('Error creating cron expression:', error);
            throw new Error(`Failed to create cron expression: ${error.message}`);
        }
    }

    private async executeTask(task: RecurringTask) {
        try {
            const sourceExpense = await this.expenseModel.findByPk(task.expense_id);
            if (!sourceExpense) {
                throw new Error('Source expense not found');
            }

            const newDate = this.calculateNextDate(task);

            await this.expenseModel.create({
                name: sourceExpense.name,
                amount: sourceExpense.amount,
                date: newDate,
                category_id: sourceExpense.category_id,
                transaction_type: sourceExpense.transaction_type,
                currency: sourceExpense.currency,
                description: sourceExpense.description,
                user_id: sourceExpense.user_id,
            });

            this.logger.log(`Successfully executed recurring task ${task.id}`);
        } catch (error) {
            this.logger.error(`Failed to execute recurring task ${task.id}: ${error.message}`);
        }
    }

    private calculateNextDate(task: RecurringTask): Date {
        const now = moment();
        let nextDate: moment.Moment;

        switch (task.interval) {
            case Interval.MINUTE:
                nextDate = now.add(1, 'minute');
                break;
            case Interval.HOURLY:
                nextDate = now.add(1, 'hour');
                break;
            case Interval.DAILY:
                nextDate = now.add(1, 'day');
                break;
            case Interval.WEEKLY:
                nextDate = now.add(1, 'week');
                break;
            case Interval.MONTHLY:
                nextDate = now.add(1, 'month');
                break;
            case Interval.YEARLY:
                nextDate = now.add(1, 'year');
                break;
            default:
                throw new Error('Invalid interval');
        }

        return nextDate.toDate();
    }
}
