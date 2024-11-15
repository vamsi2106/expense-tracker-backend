import { ConfigModule } from "@nestjs/config"
import { AppConfigService } from "src/config/appConfig.services"
import { DbModule } from "src/database/database.module"
import { AuthModule } from "src/modules/auth/auth.module"
import { CategoryModule } from "src/modules/categories/category.module"
import { ExpenseModule } from "src/modules/expenses/expense.module"
import { ExpenseTagModule } from "src/modules/expenseTags/expenseTag.module"
import { FileModule } from "src/modules/files/files.modules"
import { RecurringTaskModule } from "src/modules/recurringExpenses/recurringExpense.module"
import { UsersModule } from "src/modules/users/users.module"
import AppLogger from "./logger/app-logger"
import { APP_FILTER } from "@nestjs/core"
import { GlobalExceptionFilter } from "./logger/globalExeption.filter"
import { JwtService } from "@nestjs/jwt"

const getProviders = (): any[] => {
    return [
        AppConfigService,
        AppLogger,
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter,
        },
        JwtService
    ]
}

const importProviders = (): any[] => {
    return [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        DbModule,
        AuthModule,
        UsersModule,
        ExpenseModule,
        FileModule,
        CategoryModule,
        ExpenseTagModule,
        RecurringTaskModule]
}
const exportProviders = (): any[] => {
    return [
        DbModule,
        AppLogger,
        AppConfigService,
        AuthModule,
        UsersModule,
        ExpenseModule,
        FileModule,
        CategoryModule,
        ExpenseTagModule,
        RecurringTaskModule,
        JwtService]
}

export { getProviders, importProviders, exportProviders };
