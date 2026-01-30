import express from "express"
import {body} from "express-validator"
import {register , login , getprofile , updateprofile , changepassword} from "../controllers/authcontroller.js"
import protect from "../middleware/auth.js"
const router = express.Router();
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
 router.post("/register" , registervalidation , register)
 router.post("/login" , loginvalidation , login)
 // PROTECTED ROUTES 

 router.get("/profile" , protect , getprofile)
 router.put("/profile" , protect, updateprofile)
 router.post("/change-password" , protect , changepassword)  // protect is left to define
 export default router 