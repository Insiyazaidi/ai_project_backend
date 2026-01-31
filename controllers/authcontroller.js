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
 const newuser =  await user.create({username , email , password})
// generating token 

const token = generatingtoken(user._id)
res.status(201).json({
    success:true,
    data:{
        user:{
            id:newuser._id,
            username:newuser.username,
            email:newuser.email,
            profileimage: newuser.profileimage,
            createdat:newuser.createdAt   // chance of errorrrrrrrr *****
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
const{email , password}=req.body();
if(!email|| !password){
    return res.status(400).json({success:false , error:"Please provide email and password" , statuscode:400})
}

const checkinguser =  await user.findOne({email}).select("+password"); 
if(!checkinguser){
    return res.status(401).json({success:false , error:"Invalid Credentials" , statuscode:401})
}

const ismatch = await user.matchpassword(password);
if(!ismatch){
    return res.status(401).json({success:false , error:"Invalid credential" , statuscode:401})
}

// generate token 
const token = generatingtoken(user._id)
res.status(200).json({success:true, loggedinuser:{id:checkinguser._id ,username:checkinguser.username , email:checkinguser.email, profileimage:user.profileimage } ,
token , message:"Login sucessfull"})
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

