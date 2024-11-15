import { HttpException, HttpStatus } from "@nestjs/common";
import { handleResponse } from "./handleResponse";
import { ResponseMessages } from "./messages";

export const TryCatchBlock = async (code: () => any) => {
    try {
        return await code();
    } catch (err) {
        console.log('error logged', err);
        return handleResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: ResponseMessages.UE,
            response: undefined  // Explicitly pass response as undefined
        });
        }
};
