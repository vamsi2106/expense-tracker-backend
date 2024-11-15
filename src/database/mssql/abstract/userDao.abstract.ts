import { Role } from "src/core/enums/roles.enum";
import { User } from "../models/user.model";
import { ResponseSchema } from "src/common/handleResponse";

export abstract class AbstractUserDao{
    abstract createUser(username: string,email: string,role?: Role,userImageUrl?: any):Promise<User>;
    abstract findAll() : Promise<User[]>;
    abstract findUserById(id:string):Promise<any>;
    abstract findUserByName(username:string):Promise<User>;
    abstract findUserByEmail(email:string):Promise<User>;
    abstract updateUserById(id:string, useData: Partial<User>):any;
    abstract deleteUserById(id: string) :Promise<any>;
    abstract getUserSize():Promise<ResponseSchema>;

}