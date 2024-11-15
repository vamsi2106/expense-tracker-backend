import { ResponseSchema } from "src/common/handleResponse";
import { CreateExpenseTagDto } from "src/modules/expenseTags/DTO/createExpenseTag.dto";
import { QueryExpenseTagDto } from "src/modules/expenseTags/DTO/queryExpenseTag.dto";
import { ExpenseTag } from "../models/expenseTags.models";

export abstract class AbstractExpenseTagDao{
    abstract createTag(expenseTagData: CreateExpenseTagDto, user_id: string, expenseId: string): Promise<ResponseSchema>;
    abstract getTagsByExpenseId(expenseId: string, userId: string): Promise<ResponseSchema>;
    abstract getTagsByExpense(userId: string, params:QueryExpenseTagDto): Promise<ResponseSchema>;
    abstract updateTag(id: string, updateData: Partial<ExpenseTag>, userId: string): Promise<ResponseSchema>;
    abstract deleteTag(id: string, userId: string): Promise<ResponseSchema>;
    abstract getTagsSize(userId):Promise<ResponseSchema>;
}