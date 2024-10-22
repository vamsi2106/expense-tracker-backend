import { Injectable } from "@nestjs/common";
import { RecurringExpenseDao } from "src/database/mssql/dao/recurringExpenses.dao";
import { CreateRecurringTaskDto } from "./DTO/createRecurringExpense.dto";
import { UpdateRecurringTaskDto } from "./DTO/updateRecurringExpense.dto";
@Injectable()
export class RecurringTaskServices {
    constructor(private readonly recurringTaskDao: RecurringExpenseDao) { }

    async createTask(taskDto: CreateRecurringTaskDto, userId:string,expenseId:string) {
        return this.recurringTaskDao.createTask(taskDto,userId,expenseId)
    }

    async getAllTasks(userId:string){
        return this.recurringTaskDao.getAllTasks(userId);
    }

    async deleteTask(id:string,userId:string){
        return this.recurringTaskDao.deleteTask(id,userId);
    }

    async updateTask(updateTaskDto:UpdateRecurringTaskDto,id:string,userId:string){
        return this.recurringTaskDao.updateTask(updateTaskDto,id,userId);
    }

    async getTaskById(id:string,userId:string){
        return this.recurringTaskDao.getById(id,userId);
    }

}