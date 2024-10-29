export interface ResponseSchema{
    status:number,
    message:string,
    response?:any
}

export function handleResponse({status,message,response}:ResponseSchema){
    return {
        status,
        message,
        response
    }
}

