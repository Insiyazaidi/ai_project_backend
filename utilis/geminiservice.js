import dotenv from "dotenv"
import { GoogleGenAI } from "@google/genai"
dotenv.config()
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_KEY}) // Ye Google AI service se connect hone ka gateway hai.
if(!process.env.GEMINI_KEY){
    console.log("FATAL ERROR : GEMINI_API_KEY is not set in environment variable")
    process.exit(1)
}
 export const generateflashcards = async(text , count=10)=>{ // (PDF ya uploaded file ka actual readable content)
const prompt = `Generate exactly ${count} educational flashcards from the following text.format each flashcard as
Q: [Clear , specific question ]
A:[concise , accurate answer]
D :[Difficulty level : easy , medium , hard]
seperate each flashcard with "---" 

text: ${text.substring(0 , 15000)}`
try{
const response  = ai.models.generateContent({ // models -  ek property hai jo available AI models ko access karne deti hai 
    // generateContent - ek model h jo content deti h 
    model:"gemini-2.5-flash-lite",
    contents: prompt
})
const generatedtext =  response 
const flashcards=[]
const cards = generatedtext.split("---").filter(c=>c.trim()) // split krdo response ko on the basis of --- 
for(const card of cards){    // now we process one card ... 
    const lines = card.trim().split("\n") // now split  Q , A , D = lines   
    let question = " ", answer=" ", difficulty="medium"
    for(const line of lines){  // now lines ko process kro ek ek krke , Q ...  THEN A .... D 
        if(line.startsWith("Q:")){
            question=line.substring(2).trim()
        }
        else if( line.startsWith("A:")){
            answer=line.substring(2).trim()
        }
          else if( line.startsWith("D:")){
            const diff =line.substring(2).trim().toLowerCase()   // temp storing as diff  
            if(["easy" , "medium" , "hard"].includes(diff)){
                difficulty=diff   // then finally defining difficulty 
            }
        }
      
    }
  if(question && answer){
            flashcards.push({question , answer, difficulty}) // pushing into flashcards each time 
        }

}
return flashcards.slice(0, count)  // icase zaya hue toh remove krdena extra 

}

catch(error){
    console.log("Gemini API error", error)
    throw new Error("Failed to generate flashcards")
}

 }

 