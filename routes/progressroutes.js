import express from "express"
import {getdashboard} from "../controllers/progesscontroller.js"
import protect from "../middleware/auth.js"
const progressroute  = express.Router()
 progressroute.use(protect)
 progressroute.get("/dashboard", getdashboard)
export default  progressroute