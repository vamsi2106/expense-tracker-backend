import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { RecurringTask } from "../models/recurringExpenses.models";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from 'sequelize-typescript';
import { CreateRecurringTaskDto } from "src/modules/recurringExpenses/DTO/createRecurringExpense.dto";
import { UpdateRecurringTaskDto } from "src/modules/recurringExpenses/DTO/updateRecurringExpense.dto";

@Injectable()
export class RecurringExpenseDao {
    constructor(
        @InjectModel(RecurringTask)
        private readonly recurringTaskModel: typeof RecurringTask,
    
        @Inject(Sequelize)
        private sequelize: Sequelize
    ) {}

    async getAllTasks(userId: string) {
        try {
            console.log('triggered');
            return await this.recurringTaskModel.findAll({ where: { user_id: userId } });
        } catch (err) {
            console.error(err); // log the full error
            throw new HttpException('Unable to retrieve tasks', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createTask(createDto: CreateRecurringTaskDto, userId: string, expenseId) {
        try {
            console.log({ ...createDto, user_id: userId,expense_id:expenseId});
            const task = await this.recurringTaskModel.create({ ...createDto, user_id: userId,expense_id:expenseId });
            return task; // Return the created task
        } catch (err) {
            console.error(err); // log the full error
            throw new HttpException('Unable to create task', HttpStatus.BAD_REQUEST);
        }
    }

    async deleteTask(id: string, userId: string) {
        try {
            const task = await this.recurringTaskModel.findOne({ where: { id, user_id: userId } });
            if (!task) {
                throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            await task.destroy();
            return { message: 'Task deleted successfully' }; // Return a success message
        } catch (err) {
            console.error(err); // log the full error
            throw new HttpException('Unable to delete task', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateTask(updateTaskData: UpdateRecurringTaskDto, id: string, userId: string) {
        try {
            const task = await this.recurringTaskModel.findOne({ where: { id, user_id: userId } });
            if (!task) {
                throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            await task.update(updateTaskData);
            return task; // Return the updated task
        } catch (err) {
            console.error(err); // log the full error
            throw new HttpException('Unable to update task', HttpStatus.BAD_REQUEST);
        }
    }

    async getById(id: string, userId: string) {
        try {
            const task = await this.recurringTaskModel.findOne({ where: { id, user_id: userId } });
            if (!task) {
                throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            return task;
        } catch (err) {
            console.error(err); // log the full error
            throw new HttpException('Unable to retrieve task', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
