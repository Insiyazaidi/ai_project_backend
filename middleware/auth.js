import jwt from "jsonwebtoken"
import user from "../models/user.js"

const protect = async(req , res , next)=>{  // fixeddddd 
let token 
if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    try{
  token  = req.headers.authorization.split(' ')[1];
  // verify token 
  const decode = jwt.verify(token , process.env.JWT_SECRET);  // decode will contain pay load ... {id + timestamps  }
  req.user= await user.findById(decode.id).select("-password")  //   yha pr req.user m full user object 
  if(!req.user){
    return res.status(400).json({
      success: false,
      error:"user not found",
      statuscode: 401
    })
  }
  next();
    }
    catch(error){
  console.log('Auth middleware error' , error.message)
if(error.name==="TokenExpiredError"){
    return res.status(401).json({
    success:false ,
    error:'Token has expired',
    statuscode:401
  })
}
return res.status(401).json({
  success:false,
  error:"Not authorized , token failed" ,
  statuscode:401
})

    }

} 

// if  req.headers.authorization.startsWith("Bearer") works the try catch will execute other wise (!token ) part will ... 
if(!token){
  return res.status(401).json({
  success:false,
  error:"Not authorized , no token" ,
  statuscode:401
  })
}
}
export default protect


