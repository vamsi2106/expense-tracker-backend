import { CreateRecurringTaskDto } from "./DTO/createRecurringExpense.dto";
import { RecurringExpenseFilter } from "./DTO/recurringExpenseFilter.Dto";
import { UpdateRecurringTaskDto } from "./DTO/updateRecurringExpense.dto";

export abstract class AbstractRecurringExpense{
    abstract createTask(taskDto: CreateRecurringTaskDto, userId: string, expenseId: string);
    abstract getAllTasks(userId: string, filterParams: RecurringExpenseFilter);
    abstract getAllActiveTasks();
    abstract deleteTask(id: string, userId: string);
    abstract updateTask(updateTaskDto: UpdateRecurringTaskDto, id: string, userId: string);
    abstract getRecurringExpenseSize(user_id);
    abstract getTaskById(id: string, userId: string);
    abstract removeScheduledTask(taskId: string);
}