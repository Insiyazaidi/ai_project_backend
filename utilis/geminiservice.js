import dotenv from "dotenv"
import { GoogleGenAI } from "@google/genai"
dotenv.config()
const ai = new GoogleGenAI({apikey: process.env.GEMINI_KEY})
if(!process.env.GEMINI_KEY){
    console.log("FATAL ERROR : GEMINI_API_KEY is not set in environment variable")
    process.exit(1)
}
 export const generateflashcards = async(text , count=10)=>{
const prompt = `Generate exactly ${count} educational flashcards from the following text.format each flashcard as
Q: [Clear , specific question ]
A:[concise , accurate answer]
D :[Difficulty level : easy , medium , hard]
seperate each flashcard with "---" 

Text :{text.substring(0 , 15000)}`
try{
const response  = ai.models.generateContent({
    model:"gemini-2.5-flash-lite",
    contents: prompt
})
}

catch(error){
next(error)
}

 }