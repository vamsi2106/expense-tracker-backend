import { ResponseSchema } from "src/common/handleResponse"
import { CreateRecurringTaskDto } from "src/modules/recurringExpenses/DTO/createRecurringExpense.dto"
import { RecurringExpenseFilter } from "src/modules/recurringExpenses/DTO/recurringExpenseFilter.Dto"
import { UpdateRecurringTaskDto } from "src/modules/recurringExpenses/DTO/updateRecurringExpense.dto"

export abstract class AbstractRecurringExpenseDao{
    abstract getAllTasks(userId: string, filterParameters: RecurringExpenseFilter): Promise<ResponseSchema>;
    abstract getAllActiveTasks(): Promise<ResponseSchema>;
    abstract createTask(createDto: CreateRecurringTaskDto, userId: string, expenseId: string): Promise<ResponseSchema>;
    abstract deleteTask(id: string, userId: string): Promise<ResponseSchema>;
    abstract updateTask(updateTaskData: UpdateRecurringTaskDto, id: string, userId: string): Promise<ResponseSchema>;
    abstract updateTaskData(updateTaskData: UpdateRecurringTaskDto, id: string): Promise<ResponseSchema>;
    abstract updateTaskToDeactivate(id: string): Promise<ResponseSchema>;
    abstract getById(id: string, userId: string): Promise<ResponseSchema>;
    abstract getRecurringExpenseSize(user_id:string): Promise<ResponseSchema>;
}