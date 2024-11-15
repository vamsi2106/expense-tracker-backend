import { HttpException, HttpStatus, Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { CreateRecurringTaskDto, RecurringInterval } from "./DTO/createRecurringExpense.dto";
import { UpdateRecurringTaskDto } from "./DTO/updateRecurringExpense.dto";
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as moment from 'moment';
import { Interval } from "src/database/mssql/models/recurringExpenses.models";
import { RecurringTask } from "src/database/mssql/models/recurringExpenses.models";
import { ResponseMessages } from "src/common/messages";
import { handleResponse } from "src/common/handleResponse";
import { RecurringExpenseFilter } from "./DTO/recurringExpenseFilter.Dto";
import { AbstractRecurringExpenseDao } from "src/database/mssql/abstract/recurringExpenseDao.abstract";
import { AbstractExpenseDao } from "src/database/mssql/abstract/expenseDao.abstract";
import { DatabaseService } from "src/database/database.service";
import { AbstractRecurringExpense } from "./recurringExpense.abstract";

@Injectable()
export class RecurringTaskServices implements OnModuleInit,AbstractRecurringExpense {
    private readonly logger = new Logger(RecurringTaskServices.name);

    private readonly _expenseTxn: AbstractExpenseDao;
    private readonly _recurringExpenseTxn: AbstractRecurringExpenseDao;

    constructor(
        private readonly _dbSvc: DatabaseService,
        @Inject(SchedulerRegistry)
        private schedulerRegistry: SchedulerRegistry,
    ) {
        this._expenseTxn = this._dbSvc.expenseSqlTxn;
        this._recurringExpenseTxn = this._dbSvc.recurringExpenseSqlTxn
    }

    async onModuleInit() {
        await this.initializeTasks();
    }

    async initializeTasks() {
        const activeTasks = await this.getAllActiveTasks();
        if (activeTasks.status === 200 && activeTasks.response) {
            let currentDate = new Date();
            for (const task of activeTasks.response) {
                if (task.start_date <= currentDate) {
                    await this.scheduleTask(task);
                } else if (task.end_date && task.endDate >= currentDate) {
                    this.removeScheduledTask(task);
                }
            }
        }
    }

    paramValidation(expenseDetails: any) {
        if ([RecurringInterval.HOURLY, RecurringInterval.DAILY, RecurringInterval.MONTHLY, RecurringInterval.WEEKLY, RecurringInterval.YEARLY].includes(expenseDetails.interval)) {
            if (!expenseDetails.time) {
                return handleResponse({
                    status: HttpStatus.BAD_REQUEST,
                    message: ResponseMessages.BR
                });
            }
        }

        // Check for end_date field based on intervals
        if ([RecurringInterval.DAILY, RecurringInterval.HOURLY, RecurringInterval.MINUTE].includes(expenseDetails.interval)) {
            if (!expenseDetails.end_date) {
                return handleResponse({
                    status: HttpStatus.BAD_REQUEST,
                    message: ResponseMessages.BR
                });
            }
        }

        // Check for count field based on intervals
        if ([RecurringInterval.MONTHLY, RecurringInterval.WEEKLY, RecurringInterval.YEARLY].includes(expenseDetails.interval)) {
            if (!expenseDetails.count) {
                return handleResponse({
                    status: HttpStatus.BAD_REQUEST,
                    message: ResponseMessages.BR
                });
            }
        }
        return { status: true };
    }

    async createTask(taskDto: CreateRecurringTaskDto, userId: string, expenseId: string) {
        try {
            // Check for time field based on intervals
            let validation: any = this.paramValidation(taskDto);
           
            if (validation.status != true) {
                return validation;
            }
            const result = await this._recurringExpenseTxn.createTask(taskDto, userId, expenseId);

            if (result.status === 200 && result.response) {
                try {
                    await this.scheduleTask(result.response);
                } catch (scheduleError) {
                    this.logger.error('Schedule Task Error:', scheduleError);
                    throw new HttpException('Schedule Task Error:'+scheduleError, HttpStatus.INTERNAL_SERVER_ERROR);
                    
                    // Consider if you want to rollback the created task here
                }
            }

            return result;
        } catch (error) {
            this.logger.error('Service Error:', error);
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


    async getAllTasks(userId: string, filterParams: RecurringExpenseFilter) {
        return this._recurringExpenseTxn.getAllTasks(userId, filterParams);
    }

    async getAllActiveTasks() {
        //return await this.recurringTaskDao.getAllActiveTasks();
       return await this._recurringExpenseTxn.getAllActiveTasks();
    }

    async deleteTask(id: string, userId: string) {
        const result = await this._recurringExpenseTxn.deleteTask(id, userId);
        this.removeScheduledTask(id);
        return result;
    }



    async updateTask(updateTaskDto: UpdateRecurringTaskDto, id: string, userId: string) {
        try {
            let validation: any = this.paramValidation(updateTaskDto);
            if (validation.status != true) {
                return validation;
            }

            const result = await this._recurringExpenseTxn.updateTask(updateTaskDto, id, userId);
            if (result.status === 200 && result.response) {
                this.removeScheduledTask(id);
                await this.scheduleTask(result.response);
            }
            return result;
        } catch (err) {
            return handleResponse({ status: HttpStatus.BAD_REQUEST, message: ResponseMessages.BR })
        }
    }

    async getTaskById(id: string, userId: string) {
        return this._recurringExpenseTxn.getById(id, userId);
    }

    removeScheduledTask(taskId: string) {
        try {
            const jobName = `task_${taskId}`;
            this.schedulerRegistry.deleteCronJob(jobName);
        } catch (error) {
            this.logger.warn(`No scheduled task found for ID: ${taskId}`);
        }
    }

    async scheduleTask(task: RecurringTask) {
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

    getCronExpression(task: any): string {
        try {
            // Special case for minute interval - doesn't require time
            if (task.interval === RecurringInterval.MINUTE) {
                return '* * * * *';
            }

            let hours: number;
            let minutes: number;
            let seconds: number;

            // Check if task.time is a Date object
            if (task.time instanceof Date) {
                hours = task.time.getHours();
                minutes = task.time.getMinutes();
                seconds = task.time.getSeconds();
            }
            // Check if task.time is a string
            else if (typeof task.time === 'string') {
                [hours, minutes, seconds] = task.time.split(':').map(Number);
            }
            // If it's neither, log the type and throw an error
            else {
                this.logger.error(`Unexpected time format: ${typeof task.time}`, task.time);
                throw new Error(`Invalid time format. Expected string or Date, got ${typeof task.time}`);
            }

            // Validate time components
            if (isNaN(hours) || hours < 0 || hours > 23 ||
                isNaN(minutes) || minutes < 0 || minutes > 59 ||
                isNaN(seconds) || seconds < 0 || seconds > 59) {
                throw new Error(`Invalid time values: ${hours}:${minutes}:${seconds}`);
            }

            this.logger.debug(`Parsing time: ${hours}:${minutes}:${seconds}`);

            // Create cron expression based on interval
            switch (task.interval) {
                case RecurringInterval.HOURLY:
                    return `${minutes} * * * *`;
                case RecurringInterval.DAILY:
                    return `${minutes} ${hours} * * *`;
                case RecurringInterval.WEEKLY:
                    return `${minutes} ${hours} * * 1`;
                case RecurringInterval.MONTHLY:
                    return `${minutes} ${hours} 1 * *`;
                case RecurringInterval.YEARLY:
                    return `${minutes} ${hours} 1 1 *`;
                default:
                    throw new Error(`Unsupported interval: ${task.interval}`);
            }
        } catch (error) {
            this.logger.error(`Error creating cron expression: ${error.message}`, {
                taskTime: task.time,
                taskTimeType: typeof task.time,
                taskInterval: task.interval
            });
            throw new Error(`Failed to create cron expression: ${error.message}`);
        }
    }

    async executeTask(task: RecurringTask) {
        try {
            const newDate = this.calculateNextDate(task);
            await this._expenseTxn.addRecurringExpence(newDate, task.expense_id);

            // Update the count and set is_active to false if the count reaches 0
            if ([Interval.MONTHLY, Interval.WEEKLY, Interval.YEARLY].includes(task.interval)) {
                task.count--;
                if (task.count === 0) {
                    task.is_active = false;
                }
                // await this.recurringTaskModel.update(
                //     { count: task.count, is_active: task.is_active },
                //     { where: { id: task.id } }
                // );
                await this._recurringExpenseTxn.updateTaskData({ count: task.count, is_active: task.is_active }, task.id)
            }

            this.logger.log(`Successfully executed recurring task ${task.id}`);
        } catch (error) {
            this.logger.error(`Failed to execute recurring task ${task.id}: ${error.message}`);
        }
    }

    calculateNextDate(task: RecurringTask): Date {
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

    async getRecurringExpenseSize(user_id) {
        return await this._recurringExpenseTxn.getRecurringExpenseSize(user_id)
    }
}
