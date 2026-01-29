import jwt from "jsonwebtoken"
import user from "../models/user.js"

// generating awt token 
const generatingtoken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET , {
        expiresIn:process.env.JWT_EXPIRE || "7d"
    })
}

export const register = async(req,res , next)=>{  // frontend se  username , email , password aaya phle check krege us email ka user hai ya nhi 
// agr hai  toh  error return krdo .. aur boldo ya toh email already exist krti h ya 


    try{
 const {username , email, password} = req.body
 const userexists = await user.findOne({$or :[{email} , {username}]})
 if(userexists){
    return res.status(400).json({success:false , error: userexists.email===email? "Email already exist" : "Username already taken"})
 }
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

