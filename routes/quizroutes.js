import express from "express"
import {getquizzes, getquizbyid , submitquiz , getquizresults , deletequiz} from "../controllers/quizcontroller.js"
import protect from "../middleware/auth.js"
const quizroute = express.Router()

quizroute.use(protect)
quizroute.get("/:documentid",getquizzes)
quizroute.get("/specificquiz/:id",getquizbyid)
quizroute.post("/:id/submit",submitquiz)
quizroute.get("/:id/results",getquizresults)
quizroute.delete("/:id",deletequiz)
export default quizroute