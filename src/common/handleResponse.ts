export interface ResponseSchema{
    status:number,
    message:string,
    response?:any,
    size?:number
}

export function handleResponse({status,message,response,size}:ResponseSchema){
    return {
        status,
        message,
        response,
        size
    }
}

