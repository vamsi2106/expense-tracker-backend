import { ResponseSchema } from "src/common/handleResponse"
import { CreateExpenseDto } from "./dto/create-expense.dto"
import { ExpenseQueryDto } from "./DTO/expenseQuery.dto"
import { UpdateExpenseDto } from "./dto/update-expense.dto"

export abstract class AbstractExpense{
    abstract create(expenseData: CreateExpenseDto, userId: string, options?: any): Promise<ResponseSchema>;
    abstract findAll(userId:string, query: ExpenseQueryDto): Promise<ResponseSchema>;
    abstract findOne(userId: string, id: string): Promise<ResponseSchema>;
    abstract update(userId: string, id: string, updateExpenseDto: UpdateExpenseDto): Promise<ResponseSchema>;
    abstract remove(userId: string, id: string): Promise<ResponseSchema>;
    abstract deleteExpensesByFileId(userId: string, fileId: string, options?: any): Promise<ResponseSchema>;
    abstract getExpensesGroupedByDateWithOffset(userId: string, offset: number, file_id: string | null): Promise<ResponseSchema>;
    abstract getExpensesGroupedByCategory(userId: string, file_id: string | null, startDate?: string, endDate?: string): Promise<ResponseSchema> ;
    abstract getExpensesGroupedByWeek(userId: string, month: number, year: number, file_id: string | null): Promise<ResponseSchema>;
    abstract getExpensesGroupedByMonth(userId: string, file_id: string | null, year: number): Promise<ResponseSchema>;
    abstract getlength(user_id:string):Promise<ResponseSchema>;
}