import { Role } from "src/core/enums/roles.enum";
import { User } from "src/database/mssql/models/user.model";

export abstract class AbstractUser{
    abstract createUser(username: string,email: string,role?: Role,userImageUrl?: any): Promise<User>;
    abstract findAllUsers(): Promise<User[]>;
    abstract findUserById(id: string);
    abstract findUserByName(username: string);
    abstract findUserByEmail(email: string);
    abstract updateUserById(id: string, userData: Partial<User>);
    abstract deleteUserById(id: string);
    abstract getSize();
}