import { Injectable } from "@nestjs/common";
import * as cron from 'node-cron'

@Injectable()
export class TaskService {
    private param:string

    constructor() {
        this.param = '*/1 * * * *';
        this.scheduleTask();
    }

    async performance(){
        console.log('task executed', new Date().getTime());
        try{
            console.log('task performed sucessfully');
        }
        catch(error){
            console.log('Error while performing the task',error);
        }
    }

    scheduleTask(){
        cron.schedule(this.param, async ()=>{
            await this.performance();
        })
        console.log('task scheduled to run every minute');
    }
}
