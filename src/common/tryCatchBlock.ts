import { HttpException, HttpStatus } from "@nestjs/common"
import { handleResponse } from "./handleResponse"
import { ResponseMessages } from "./messages"

export const TryCatchBlock = async (code: () => any) => {
    try {
        return await code()
    } catch (err) {
        console.log('error logged', err);
        throw new HttpException(ResponseMessages.UE, HttpStatus.INTERNAL_SERVER_ERROR,  )
        //throw new HttpException(Response.arguments,HttpStatus.INTERNAL_SERVER_ERROR)
    }
}