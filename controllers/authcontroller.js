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
    return res.status(400).json({success:false , error: userexists.email===email? "Email already exist" : "Username already taken" , statuscode:400 } )
 }

 // if user doesnt exsit then create 
 const user =  await user.create({username , email , password})
// generating token 

const token = generatingtoken(user._id)
res.status(201).json({
    success:true,
    data:{
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            profileimage: user.profileimage,
            createdat:user.createdAt   // chance of errorrrrrrrr *****
            }, 
            token , 
            
    } ,
    message:"User register successfully"
})


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

