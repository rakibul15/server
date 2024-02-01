import userRouter from "./routes/user.route";

require('dotenv').config();
import express, { NextFunction, Request, Response } from "express"
export const app=express();

import cors from "cors"
import cookieParser from "cookie-parser"

import { ErrorMiddleware } from "./middleware/error";


// Body Parser limit
app.use(express.json({limit:"50mb"}));

// cookie Parser
app.use(cookieParser());

// Cors=> cross origin resource sharing
app.use(cors({
    origin:process.env.ORIGIN
}))
// routes
app.use("/api/v1",userRouter)

// Testing  Api
app.get("/test",(req:Request,res:Response, next:NextFunction)=>{
    res.status(200).json({
        success:true,
        message:"API is working",
    })
})

// Unkonwn Route

app.all("*",(req:Request, res:Response,next:NextFunction)=>{
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode=404;
    next(err);

})

app.use(ErrorMiddleware)
