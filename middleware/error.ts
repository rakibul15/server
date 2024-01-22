import { NextFunction } from 'express';
import { Response } from 'express';
import { Request } from 'express';
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware=(err:any, req:Request, res:Response, next:NextFunction)=>{
    err.statusCode || 500;
    err.message=err.message || 'Internal server error';
    if(err.name ==='castError'){
        const message=`Resource not found. Invalid:${err.path}`;
        err=new ErrorHandler(message,400)
    }
    // Duplicate key Error
    if(err.code===11000){
        const message=`Duplicate:${Object.keys(err.keyValue)} entered`;
        err=new ErrorHandler(message,400)
    }

    // Wrong Jwt Error
    if(err.name === 'JsonWebtokenError'){
        const message=`Json web token is invalid, try again`;
        err=new ErrorHandler(message,400)
    }

     //Jwt Expireed Error
     if(err.name === 'JsonWebtokenError'){
        const message=`Json web token is expired, try again`;
        err=new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })

}
