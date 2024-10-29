import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { RecurringTaskServices } from "./recurringExpenses.service";
import { JwtAuthGuard } from "../auth/jwt-auth-guard.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateRecurringTaskDto } from "./DTO/createRecurringExpense.dto";
import { UpdateRecurringTaskDto } from "./DTO/updateRecurringExpense.dto";
import { ResponseMessages } from "src/common/messages";

@ApiBearerAuth()
@ApiTags('Recurring tasks management')
@Controller('/recurring/task')
export class RecurringExpenseController {
    constructor(private readonly recurringExpenseService: RecurringTaskServices) { }

    // @UseGuards(JwtAuthGuard)
    // @Post('/add/:expenseId')
    // @ApiOperation({ summary: 'create a new recurrin task' })
    // async create(@Param('expenseId') expenseId: string, @Req() req: any, @Body() createTaskDetails: CreateRecurringTaskDto) {
    //     try {
    //         console.log('called')
    //         let userId = req.user.user_id;
    //         let date = new Date()
    //         createTaskDetails.is_active = true;
    //         return this.recurringExpenseService.createTask(createTaskDetails, userId, expenseId);

    //     } catch (err) {
    //         console.log(err);
    //         return new HttpException(ResponseMessages.UE, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }


    @UseGuards(JwtAuthGuard)
    @Post('/add/:expenseId')
    @ApiOperation({ summary: 'create a new recurring task' })
    async create(
        @Param('expenseId') expenseId: string, 
        @Req() req: any, 
        @Body() createTaskDetails: CreateRecurringTaskDto
    ) {
        try {
            const userId = req.user.user_id;
            createTaskDetails.is_active = true;
            const result = await this.recurringExpenseService.createTask(
                createTaskDetails, 
                userId, 
                expenseId
            );
            
            // Return proper response based on the result
            return {
                statusCode: result.status,
                message: result.message,
                data: result.response
            };

        } catch (err) {
            console.error('Controller Error:', err);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: err.message || ResponseMessages.UE,
                    error: 'Internal Server Error'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'It fetches all available recurrin tasks' })
    async getAllTasks(@Req() req: any) {
        let userId = req.user.user_id;
        return this.recurringExpenseService.getAllTasks(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/active")
    @ApiOperation({ summary: 'It fetches all available recurrin tasks' })
    async getAllActiveTasks(@Req() req: any) {
        return this.recurringExpenseService.getAllActiveTasks();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/get/:id')
    @ApiOperation({ summary: 'It fetch the Task that matches with the given id' })
    async getTaskBId(@Req() req: any, @Param('id') id: string) {
        let userId = req.user.user_id;
        return this.recurringExpenseService.getTaskById(id, userId);

    }

    @UseGuards(JwtAuthGuard)
    @Put('/update/:id')
    @ApiOperation({ summary: 'Updates the Task' })
    async upadteTask(@Req() req: any, @Param('id') id: string, @Body() updateDetails: UpdateRecurringTaskDto) {
        let userId = req.user.user_id;
        return this.recurringExpenseService.updateTask(updateDetails, id, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:id')
    @ApiOperation({ summary: 'Delete The Recurring Task' })
    async deleteTask(@Req() req: any, @Param('id') id: string) {
        return this.recurringExpenseService.deleteTask(id, req.user.user_id)
    }

}