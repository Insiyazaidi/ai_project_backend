import jwt from "jsonwebtoken"
import user from "../models/user.js"

const protect = async(req , res , next)=>{  // git hub
let token 
if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    try{
  token  = req.headers.authorization.split(' ')[1];
  // verify token 
  const decode = jwt.verify(token , process.env.JWT_SECRET);
  req.user= await user.findById(decode.id).select("-password")
    }
    catch(error){

    }
}
}