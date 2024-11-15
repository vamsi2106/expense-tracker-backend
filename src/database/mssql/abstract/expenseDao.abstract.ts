import { ResponseSchema } from "src/common/handleResponse";
import { CreateExpenseDto } from "src/modules/expenses/dto/create-expense.dto";
import { ExpenseQueryDto } from "src/modules/expenses/DTO/expenseQuery.dto";
import { UpdateExpenseDto } from "src/modules/expenses/dto/update-expense.dto";

export abstract class AbstractExpenseDao{
    abstract getCategoryId(category: string, userId: string): Promise<ResponseSchema>;
    abstract createExpense(createExpenseDto: CreateExpenseDto,userId: string,options?: any): Promise<ResponseSchema> ;
    abstract findAllExpenses(userId: string, query: ExpenseQueryDto): Promise<ResponseSchema> ;
    abstract findExpenseById(userId: string, id: string): Promise<any>;
    abstract updateExpense(userId: string, id: string, updateExpenseDto: UpdateExpenseDto): Promise<ResponseSchema>;
    abstract  deleteExpense(userId: string, id: string): Promise<ResponseSchema>;
    abstract deleteExpensesByFileId(userId: string, fileId: string, options?: any): Promise<ResponseSchema> ;
    abstract  getExpensesGroupedByDateWithOffset(userId: string,offset: number,file_id: string | null ): Promise<ResponseSchema>;
    abstract getExpensesGroupedByCategory(userId: string,startDate: string | null,endDate: string | null, file_id: string | null): Promise<ResponseSchema> 
    abstract  getExpensesGroupedByWeek(userId: string,month: number, year: number,file_id: string | null ): Promise<ResponseSchema>;
    abstract getExpensesGroupedByWeek(userId: string, month: number, year: number, file_id: string | null): Promise<ResponseSchema>;
    abstract getExpensesGroupedByMonth(userId: string,year: number,file_id: string | null): Promise<ResponseSchema>;
    abstract getTotalLength(user_id:string):Promise<ResponseSchema>;
    abstract addRecurringExpence(newDate:any,expense_id: string): Promise<any> ;
}
