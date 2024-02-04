require('dotenv').config()
import mongoose,{Document,Model,Schema} from "mongoose";
import bcrypt from "bcryptjs"
import { NextFunction } from "express";
import jwt from 'jsonwebtoken'


const emailRegexPattern:RegExp=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
    avatar:{
        public_id:string;
        url:string;
    },
    role:string;
    isverified:boolean;
    courses:Array<{courseId: string}>
    comparePassword(password:string):Promise<boolean>;
    SignAccessToken:()=>string;
    SignRefreshToken:()=>string;
}

const userSchema:Schema<IUser>=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        validate:{
            validator:function(value:string){
                return emailRegexPattern.test(value)
            },
            message:"Please enter a valid email"
        },
        unique:true,
    },

    password:{
        type:String,
        required:[true,"Please enter your password"],
        minlength:[6, "Password must be at least 6 characters"],
        select:false,
    },
    avatar:{
        public_id:String,
        url:String,
    },
    role:{
        type:String,
        default:"user",
    },
    isverified:{
        type:Boolean,
        default:false,
    },
    courses:[
        {
            courseId:String
        }
    ],


},{timestamps:true})

// Hash Password befor saving
userSchema.pre<IUser>('save',async function(next) {
    if(!this.isModified('password')){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
    next();
})
// Sign Access token
userSchema.methods.SignAccessToken=function(){
    return jwt.sign({id:this._id},process.env.ACCEES_TOKEN || '',{
        expiresIn:"5m"
    })
}

// Sign Refresh Token
userSchema.methods.SignRefreshToken=function(){
    return jwt.sign({id:this._id},process.env.REFRESH_TOKEN || '')
}

// compare password
userSchema.methods.comparePassword=async function (enteredPassword:string):Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password)
}

const userModel:Model<IUser>=mongoose.model("User",userSchema);
export default userModel;
