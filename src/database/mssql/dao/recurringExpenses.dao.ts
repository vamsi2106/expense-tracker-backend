import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { RecurringTask } from "../models/recurringExpenses.models";
import { Sequelize } from 'sequelize-typescript';
import { CreateRecurringTaskDto } from "src/modules/recurringExpenses/DTO/createRecurringExpense.dto";
import { UpdateRecurringTaskDto } from "src/modules/recurringExpenses/DTO/updateRecurringExpense.dto";
import { Op } from "sequelize";
import { handleResponse, ResponseSchema } from "src/common/handleResponse";
import { TryCatchBlock } from "src/common/tryCatchBlock";
import { ResponseMessages } from "src/common/messages";
import { RecurringExpenseFilter } from "src/modules/recurringExpenses/DTO/recurringExpenseFilter.Dto";
import { AbstractRecurringExpenseDao } from "../abstract/recurringExpenseDao.abstract";
import { msSqlConstants } from "../connection/constants.mssql";
import AppLogger from "src/core/logger/app-logger";

@Injectable()
export class RecurringExpenseDao implements AbstractRecurringExpenseDao{
    constructor(
        @Inject(msSqlConstants.RecurrinTask)
        private readonly recurringTaskModel: typeof RecurringTask,
        private readonly _logger : AppLogger
    ) {}

    async getAllTasks(userId: string, filterParameters: RecurringExpenseFilter): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            const { name, start_date, end_date, interval, time, is_active, limit = 50, offset = 0 } = filterParameters;
    
            const whereCondition: any = {
                user_id: userId
            };
    
            if (name) {
                whereCondition.name = { [Op.like]: `%${name}%` };
            }
    
            if (start_date) {
                whereCondition.start_date = { [Op.gte]: start_date };
            }
    
            if (end_date) {
                whereCondition.end_date = { [Op.lte]: end_date };
            }
    
            if (interval) {
                whereCondition.interval = { [Op.in]: interval.split(',') };
            }
    
            if (time) {
                whereCondition.time = time;
            }
    
            if (typeof is_active !== 'undefined') {
                whereCondition.is_active = is_active;
            }
    
            const data = await this.recurringTaskModel.findAll({
                where: whereCondition,
                limit,
                offset
            });
            let size = await RecurringTask.count({
                where: { user_id:userId }
            });
    
            return handleResponse({ status: HttpStatus.OK, response: data, message: ResponseMessages.GS, size });
        });
    }

    async getAllActiveTasks():Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            let query = await this.recurringTaskModel.findAll({ where: { is_active: true } })
            return handleResponse({ status: HttpStatus.OK, response: query, message: ResponseMessages.GS });
        })

    }

    async createTask(createDto: CreateRecurringTaskDto, userId: string, expenseId: string): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            // Validate date
            const startDate = new Date(createDto.start_date);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            if (startDate < currentDate) {
                return handleResponse({
                    status: HttpStatus.BAD_REQUEST,
                    message: ResponseMessages.INVALID
                });
            }

            // Check for existing task
            const isExist = await this.recurringTaskModel.findOne({
                where: {
                    [Op.or]: [
                        { name: createDto.name, },
                        { expense_id: expenseId, }
                    ],
                    user_id: userId
                }
            });

            if (isExist) {
                return handleResponse({
                    status: HttpStatus.CONFLICT,
                    message: ResponseMessages.DExist
                });
            }
            createDto.is_active = true;
            // Create task
            const task = await this.recurringTaskModel.create({
                ...createDto,
                user_id: userId,
                expense_id: expenseId
            });

            return handleResponse({
                status: HttpStatus.OK,
                response: task,
                message: ResponseMessages.PS
            });
        });
    }

    async deleteTask(id: string, userId: string):Promise<ResponseSchema> {
        try {
            const task = await this.recurringTaskModel.findOne({ where: { id, user_id: userId } });
            if (!task) {
                return handleResponse({ message: ResponseMessages.DataNot, status: HttpStatus.NOT_FOUND });
            }
            let response = await task.destroy();
            return handleResponse({ message: ResponseMessages.DS, status: HttpStatus.OK, response }); // Return a success message
        } catch (err) {
            return handleResponse({message:ResponseMessages.DE, status:HttpStatus.INTERNAL_SERVER_ERROR});
        }
    }

    async updateTask(updateTaskData: UpdateRecurringTaskDto, id: string, userId: string): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            const task = await this.recurringTaskModel.findOne({ where: { id, user_id: userId } });
            if (!task) {
                return handleResponse({ message: ResponseMessages.DataNot, status: HttpStatus.NOT_FOUND });
            }
            let response = await task.update(updateTaskData);
            return handleResponse({ message: ResponseMessages.PutS, status: HttpStatus.OK, response });
        })
    }

    async updateTaskData(updateTaskData: UpdateRecurringTaskDto, id: string): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            const task = await this.recurringTaskModel.findOne({ where: { id } });
            if (!task) {
                return handleResponse({ message: ResponseMessages.DataNot, status: HttpStatus.NOT_FOUND });
            }
            let response = await task.update(updateTaskData);
            return handleResponse({ message: ResponseMessages.PutS, status: HttpStatus.OK, response });
        })
    }

    async updateTaskToDeactivate(id: string):Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            const task = await this.recurringTaskModel.findOne({ where: { id } });
            if (!task) {
                return handleResponse({ message: ResponseMessages.DataNot, status: HttpStatus.NOT_FOUND });
            }
            let response = await task.update({ is_active: false });
            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.PutS, response });
        })
    }

    async getById(id: string, userId: string):Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            const task = await this.recurringTaskModel.findOne({ where: { id, user_id: userId } });
            if (!task) {
                throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.GS, response: task });
        })
    }

    async getRecurringExpenseSize(user_id:string):Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            let response = await RecurringTask.count({
                where: { user_id }
            });
            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.GS, response: { size: response } })
        })
    }
}
