import express from "express"
import {generateflashcards , generatequiz , generatesummary , chat , explainconcept , getchathistory} from "../controllers/aicontroller.js"
import protect from "../middleware/auth.js"
const airoute = express.Router()
airoute.use(protect)
airoute.post("/generate-flashcards" , generateflashcards)
airoute.post("/generate-quiz" ,generatequiz)
airoute.post("/generate-summary" , generatesummary)
airoute.post("/chat" , chat)
airoute.post("/explain-concept" , explainconcept)
airoute.get("/chat-history/:documentid" , getchathistory)

export default airoute 
