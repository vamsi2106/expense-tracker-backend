import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { RecurringTaskServices } from "./recurringExpenses.service";
import { JwtAuthGuard } from "../auth/jwtAuthGuard.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateRecurringTaskDto, RecurringInterval } from "./DTO/createRecurringExpense.dto";
import { UpdateRecurringTaskDto } from "./DTO/updateRecurringExpense.dto";
import { RecurringExpenseFilter } from "./DTO/recurringExpenseFilter.Dto";
import { AbstractRecurringExpense } from "./recurringExpense.abstract";

@ApiBearerAuth()
@ApiTags('Recurring tasks management')
@Controller('/recurring/task')
@UseGuards(JwtAuthGuard)
export class RecurringExpenseController {
    constructor(private readonly _recurringExpenseService: AbstractRecurringExpense) { }


    @Post('/add/:expenseId')
    @ApiOperation({ summary: 'Create a new recurring task' })
    async create(
        @Param('expenseId') expenseId: string,
        @Req() req: any,
        @Body() createTaskDetails: CreateRecurringTaskDto
    ) {
        const userId = req.user.user_id;
        // Call service to create the recurring task
        return await this._recurringExpenseService.createTask(
            createTaskDetails,
            userId,
            expenseId
        )

    }

    @Post()
    @ApiOperation({ summary: 'It fetches all available recurrin tasks' })
    async getAllTasks(@Req() req: any, @Body() filterParams: RecurringExpenseFilter) {
        let userId = req.user.user_id;
        return this._recurringExpenseService.getAllTasks(userId, filterParams);
    }

    @Get('/fetch/size')
    @ApiOperation({ summary: 'It fetches size  of available recurrin tasks' })
    async getSize(@Req() req: any) {
        let userId = req.user.user_id;
        return await this._recurringExpenseService.getRecurringExpenseSize(userId);
    }

    @Get("/active")
    @ApiOperation({ summary: 'It fetches all available recurrin tasks' })
    async getAllActiveTasks() {
        return this._recurringExpenseService.getAllActiveTasks();
    }

    @Get('/get/:id')
    @ApiOperation({ summary: 'It fetch the Task that matches with the given id' })
    async getTaskBId(@Req() req: any, @Param('id') id: string) {
        let userId = req.user.user_id;
        return this._recurringExpenseService.getTaskById(id, userId);

    }

    @Put('/update/:id')
    @ApiOperation({ summary: 'Updates the Task' })
    async upadteTask(@Req() req: any, @Param('id') id: string, @Body() updateDetails: UpdateRecurringTaskDto) {
        let userId = req.user.user_id;
        return this._recurringExpenseService.updateTask(updateDetails, id, userId);
    }
    
    @Delete('/delete/:id')
    @ApiOperation({ summary: 'Delete The Recurring Task' })
    async deleteTask(@Req() req: any, @Param('id') id: string) {
        return this._recurringExpenseService.deleteTask(id, req.user.user_id)
    }

}