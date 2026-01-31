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
const{email , password}=req.body;
if(!email|| !password){
    return res.status(400).json({success:false , error:"Please provide email and password" , statuscode:400})
}

const checkinguser =  await user.findOne({email}).select("+password"); 
if(!checkinguser){
    return res.status(401).json({success:false , error:"Invalid Credentials" , statuscode:401})
}

const ismatch = await checkinguser.matchpassword(password);   // calling the function  which we included using user.model 
if(!ismatch){
    return res.status(401).json({success:false , error:"Invalid credential" , statuscode:401})
}


// generate token 
const token = generatingtoken(checkinguser._id)
res.status(200).json({success:true, loggedinuser:{id:checkinguser._id ,username:checkinguser.username , email:checkinguser.email, profileimage:checkinguser.profileimage } ,
token , message:"Login sucessfull"})
    }
    catch(error){
   next(error);
    }
}


export const getprofile = async(req,res , next)=>{
    try{
const profileuser = await user.findById(req.user._id); // req.user contain full userdata .. because we wrote that in protect middleware
res.status(200).json({success:true , data:{ id: profileuser._id , username:profileuser.username , email:profileuser.email , profileimage:profileuser.profileimage
    , createdat : profileuser.createdAt , updateat:profileuser.updatedAt
}})


    }
    catch(error){
   next(error);
    }
}


export const updateprofile = async(req,res)=>{
    try{
 const {username , email , profileimage} = req.body
 const  updateprouser = await user.findById(req.user._id)
 if(username) updateprouser.username= username // db se jo username aaya h aur jo req.body se aaya h vo same h ?
 if(email) updateprouser.email = email
if(profileimage) updateprouser.profileimage=profileimage

await updateprouser.save();
return res.status(200).json({success:true , data:{id:updateprouser._id , username:updateprouser.username , email:updateprouser.email,
    profileimage:updateprouser.profileimage
} , message:"Profile updated successfully"})


 }

    catch(error){
   console.log(error)
      return res.status(500).json({ message: "Server error" })
    }

}


export const changepassword = async(req,res , next)=>{
    try{

 const {currentpass , newpass} = req.body
  if(!currentpass || !newpass){
    return res.status(400).json({success:false , error:"Please provide curr and new password" , statuscode: 400})
  }
const changeuser = await user.findById(req.user._id).select("+password")
const ismatch = await changeuser.matchpassword(currentpass)
// matching the password ..
if(!ismatch){
    return res.status(401).json({
    success:false , error:"current password is incorrect",
    statuscode:401
})

}
// updating the password 
changeuser.password = newpass;
await changeuser.save()
 res.status(200).json({success:true , message:"Password changed successfully"})

    }
    catch(error){
   next(error);
    }
}

