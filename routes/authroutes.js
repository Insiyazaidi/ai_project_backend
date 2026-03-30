import express from "express"
import {body} from "express-validator"
import {register , login , getprofile , updateprofile , changepassword} from "../controllers/authcontroller.js"
import protect from "../middleware/auth.js"
const authroute = express.Router();
// validation middleware
const registervalidation = [
    body("username").trim().isLength({min:3}).withMessage("username must be atleast 3 characters"),
    body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail(),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters")

];

const loginvalidation = [
    body("username").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("password is required")
];
 // ROUTES 
 authroute.post("/register" , registervalidation , register)
 authroute.post("/login" , loginvalidation , login)
 // PROTECTED ROUTES 

 authroute.get("/profile" , protect , getprofile)
 authroute.put("/profile" , protect, updateprofile)
 authroute.put("/change-password" , protect , changepassword)  
 export default authroute