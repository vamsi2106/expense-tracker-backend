import { ResponseSchema } from "src/common/handleResponse"
import { CreateExpenseTagDto } from "./DTO/createExpenseTag.dto"
import { QueryExpenseTagDto } from "./DTO/queryExpenseTag.dto"

export abstract class AbstractExpenseTag{
    abstract createExpenseTag(expenseTagDto:CreateExpenseTagDto, userId: string, expenseId: string): Promise<ResponseSchema> ;
    abstract getTagsForExpense(expenseId: string, userId: string): Promise<ResponseSchema> ;
    abstract getALLTagsForExpense(userId: string, param:QueryExpenseTagDto): Promise<ResponseSchema>;
    abstract updateExpenseTag(id: string, updateExpenseTagDto: CreateExpenseTagDto, userId: string): Promise<ResponseSchema>;
    abstract deleteExpenseTag(id: string, userId: string): Promise<ResponseSchema>;
    abstract getExpensesTagSize(userId:string): Promise<ResponseSchema>;
}