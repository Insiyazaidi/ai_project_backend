import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import { defaultAllowedOrigins } from "vite";
const userschema = new mongoose.Schema({
   username:{
    type:String ,
    trim:true,
    unique:true, 
    minlength:[3, 'Username must be atleast 3 characters long'],

   } ,
   email:{
    type:String,
    required:[true , "Please provide an email"],
    unique: true,
    lowercase:true,
    match:[/^\S+@\S+\.\S+$/, "Please provide a valid email"]

   }  ,
   password:{
      type:String,
  required:[true , "Please provide a password"],
  minlength:[6 , "Password msut be at least 6 characters long"],
  select:false
   } ,
   profileimage:{
      type:String,
      default:null
   } , 


} , {timestamps:true})
// hashing password before saving 
userschema.pre("save" , async function (next) {  // save hone se phle yeh run hoga 
   if(!this.isModified("password")){    // agr password modify nhi hua .. toh next call hoga  , this points to current user 
 return  next();  // yeh mongoose se hi aaya h function hme isko define krne ki zaroorat nhi h  , yha se return krdia next function taaki neeche 
 // yeh neeche password ki hasing na ho phir se agr password chnage nhi hua h .. 
   } 
const salt = await bcrypt.genSalt(10)
this.password = await bcrypt.hash(this.password , salt)
})
// compare password method
userschema.methods.matchPassword=async function(enteredPassword){
   return bcrypt.compare(enteredPassword , this.password)
}

const user = mongoose.model("user" , userschema)
export default user;




