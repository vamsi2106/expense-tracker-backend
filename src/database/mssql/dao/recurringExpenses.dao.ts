import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { RecurringTask } from "../models/recurringExpenses.models";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from 'sequelize-typescript';
import { CreateRecurringTaskDto } from "src/modules/recurringExpenses/DTO/createRecurringExpense.dto";
import { UpdateRecurringTaskDto } from "src/modules/recurringExpenses/DTO/updateRecurringExpense.dto";
import { QueryTypes } from "sequelize";
import { handleResponse, ResponseSchema } from "src/common/handleResponse";
import { TryCatchBlock } from "src/common/tryCatchBlock";
import { ResponseMessages } from "src/common/messages";

@Injectable()
export class RecurringExpenseDao {
    constructor(
        @InjectModel(RecurringTask)
        private readonly recurringTaskModel: typeof RecurringTask,

        @Inject(Sequelize)
        private sequelize: Sequelize
    ) { }

    async getAllTasks(userId: string): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            let data = await this.recurringTaskModel.findAll({ where: { user_id: userId } });
            return handleResponse({ status: HttpStatus.OK, response: data, message: ResponseMessages.GS });
        })
    }

    async getAllActiveTasks(): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            let query = await this.recurringTaskModel.findAll({where : {is_active : true}})

            //console.log(query);
            return handleResponse({ status: HttpStatus.OK, response: query, message: ResponseMessages.GS });
        })

    }


    // async createTask(createDto: CreateRecurringTaskDto, userId: string, expenseId) {
    //     return TryCatchBlock(async () => {
    //         console.log({ ...createDto, user_id: userId, expense_id: expenseId });
    //         let {start_date} = createDto;
    //         let dateTransformation = new Date(start_date);
    //         let currentDate = new Date();
    //         currentDate.setHours(0, 0, 0, 0,);

    //         if(dateTransformation<currentDate){
    //             return handleResponse({status : HttpStatus.BAD_REQUEST, message:ResponseMessages.INVALID});
    //         } 

    //         let IsExist = await this.recurringTaskModel.findOne({where : {name:createDto.name,user_id : userId}})
    //         if(IsExist){
    //             return handleResponse({status: HttpStatus.CONFLICT,message:ResponseMessages.RExist})
    //         }
    //         const task = await this.recurringTaskModel.create({ ...createDto, user_id: userId, expense_id: expenseId });
    //         return handleResponse({ status: HttpStatus.OK, response: task, message: ResponseMessages.PS });
    //     })
    // }



    async createTask(createDto: CreateRecurringTaskDto, userId: string, expenseId: string) {
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
                    name: createDto.name,
                    user_id: userId
                }
            });

            if (isExist) {
                return handleResponse({
                    status: HttpStatus.CONFLICT,
                    message: ResponseMessages.RExist
                });
            }

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


    async deleteTask(id: string, userId: string) {
        try {
            const task = await this.recurringTaskModel.findOne({ where: { id, user_id: userId } });
            if (!task) {
                return handleResponse({ message: ResponseMessages.DataNot, status: HttpStatus.NOT_FOUND });
            }
            let response = await task.destroy();
            return handleResponse({ message: ResponseMessages.DS, status: HttpStatus.OK, response }); // Return a success message
        } catch (err) {
            console.error(err); // log the full error
            throw new HttpException('Unable to delete task', HttpStatus.INTERNAL_SERVER_ERROR);
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

    async updateTaskToDeactivate(id: string) {
        return TryCatchBlock(async () => {
            const task = await this.recurringTaskModel.findOne({ where: { id } });
            if (!task) {
                return handleResponse({ message: ResponseMessages.DataNot, status: HttpStatus.NOT_FOUND });
            }
            let response = await task.update({ is_active: false });
            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.PutS, response });
        })
    }


    async getById(id: string, userId: string) {
        return TryCatchBlock(async () => {
            const task = await this.recurringTaskModel.findOne({ where: { id, user_id: userId } });
            if (!task) {
                throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.GS, response: task });
        })
    }
}
