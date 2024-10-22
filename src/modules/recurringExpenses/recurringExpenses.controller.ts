import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { RecurringTaskServices } from "./recurringExpenses.service";
import { JwtAuthGuard } from "../auth/jwt-auth-guard.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateRecurringTaskDto } from "./DTO/createRecurringExpense.dto";
import { UpdateRecurringTaskDto } from "./DTO/updateRecurringExpense.dto";

@ApiBearerAuth()
@ApiTags('Recurring tasks management')
@Controller('/recurring/task')
export class RecurringExpenseController{
    constructor(private readonly recurringExpenseService : RecurringTaskServices){}

    @UseGuards(JwtAuthGuard)
    @Post('/add/:expenseId')
    @ApiOperation({summary:'create a new recurrin task'})
    async create(@Param('expenseId') expenseId:string,@Req() req:any ,@Body() createTaskDetails:CreateRecurringTaskDto){
        console.log('called')
        let userId = req.user.user_id;
        createTaskDetails.is_active = true; 
        return this.recurringExpenseService.createTask(createTaskDetails,userId,expenseId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({summary:'It fetches all available recurrin tasks'})
    async getAllTasks(@Req() req:any){
        let userId = req.user.user_id;
        return this.recurringExpenseService.getAllTasks(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/get/:id')
    @ApiOperation({summary:'It fetch the Task that matches with the given id'})
    async getTaskBId(@Req() req:any, @Param('id') id:string){
        let userId = req.user.user_id;
        return this.recurringExpenseService.getTaskById(id,userId);

    }

    @UseGuards(JwtAuthGuard)
    @Put('/update/:id')
    @ApiOperation({summary:'Updates the Task'})
    async upadteTask(@Req() req:any, @Param('id') id:string, @Body() updateDetails : UpdateRecurringTaskDto){
        let userId = req.user.user_id;
        return this.recurringExpenseService.updateTask(updateDetails,id,userId);
    }

}