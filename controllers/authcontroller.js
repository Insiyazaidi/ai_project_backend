import jwt from "jsonwebtoken"
import user from "../models/user.js"

// generating awt token 
const generatingtoken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET , {
        expiresIn:process.env.JWT_EXPIRE || "7d"
    })
}

export const register = async(req,res , next)=>{
    try{

    }
    catch(error){
   next(error);
    }
}
export const login = async(req,res , next)=>{
    try{

    }
    catch(error){
   next(error);
    }
}
export const getprofile = async(req,res , next)=>{
    try{

    }
    catch(error){
   next(error);
    }
}
export const updateprofile = async(req,res , next)=>{
    try{

    }
    catch(error){
   next(error);
    }
}

export const changepassword = async(req,res , next)=>{
    try{

    }
    catch(error){
   next(error);
    }
}

