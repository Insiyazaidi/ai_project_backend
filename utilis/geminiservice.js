import dotenv from "dotenv"
import { GoogleGenAI } from "@google/genai"
dotenv.config()
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY}) // Ye Google AI service se connect hone ka gateway hai.
if(!process.env.GEMINI_API_KEY){
    console.log("FATAL ERROR : GEMINI_API_KEY is not set in environment variable")
    process.exit(1)
}
 export const aiflashcards = async(text , count=10)=>{ // (PDF ya uploaded file ka actual readable content)
const prompt = `Generate exactly ${count} educational flashcards from the following text.format each flashcard as
Q: [Clear , specific question ]
A:[concise , accurate answer]
D :[Difficulty level : easy , medium , hard]
seperate each flashcard with "---" 

text: ${text.substring(0 , 15000)}`
try{
const response  = await ai.models.generateContent({ // models -  ek property hai jo available AI models ko access karne deti hai 
    // generateContent - ek model h jo content deti h 
    model:"gemini-2.5-flash-lite",
    contents: prompt
})
const generatedtext =  response.text 
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
return flashcards.slice(0, count)  // icase zaya hue toh remove krdena extra  .. it will return an array finally 

}

catch(error){
    console.log("Gemini API error", error)
    throw new Error("Failed to generate flashcards")
}

 }


 export const aiquiz = async(text , numques = 5)=>{
    
    const prompt = `Generate exactly ${numques} multiple choice questions from text .format each question as :
    Q:[Question]
    01:[option 1]  02:[option 2]  03:[option 3]  04:[option 4] 
    C :[Correct option - exactly as written above]
    E:[Brief explanation]
    D:[Difficulty:easy , medium or hard]
    seperate questions with "---"
    Text:${text.substring(0, 15000)}`
try{
const response = ai.models.generateContent({
     model:"gemini-2.5-flash-lite",
    contents: prompt
})
const generatedtext = response.text
const questions=[]
const questionblock = generatedtext.split("---").filter(q=>q.trim())
for(const block of questionblock){
    const lines = block.trim().split("\n")
    let question=" ", option=[], correctanswer=" ", explanation = " ", difficulty="medium"
    for(const line of lines){
        const trimmed = line.trim()
        if(trimmed.startsWith("Q:")){
            question = trimmed.substring(2).trim()
        }
         else if(trimmed.startsWith("/^0\d:/")){
            question = trimmed.substring(3).trim()
        }
    }
}

}
catch(error){
  console.log("Gemini API error", error)
    throw new Error("Failed to generate Quiz")
}
 }

 export const aisummary = async(text)=>{
    const prompt = `Provide a concise summary of the following text  , highlighting the key concepts , main idea and important points keep the 
    summary clear and structure
    text: ${text.substring(0 , 20000)}`
    try{
const response = await ai.models.generateContent({
       model:"gemini-2.5-flash-lite",
    contents: prompt
})
const generatedtext = response.text
return generatedtext

    }
    catch(error){
            console.log("Gemini API error", error)
    throw new Error("Failed to generate flashcards")
    }
 }
 export const aichatWithcontext = async(question , chunks)=>{  // chunks is an object .. jiske ek property h content .. textchunker.js m dekho
const context = chunks.map((c,i)=>`[chunk ${i+1}\n ${c.content}]`).join("\n\n") // structuring the data coming from chunks
// chunk 1 content ... , chunk 2 content ... 
const prompt = `Based on the following context from a document , Analyse the context and answer the user's question if the answer is 
not in the context , say no 
context:${context}
question:${question}
answer`
try{
   const response = await ai.models.generateContent({
       model:"gemini-2.5-flash-lite",
    contents: prompt
}) 
const generatedtext = response.text
return generatedtext
}

   catch(error){
            console.log("Gemini API error", error)
    throw new Error("Failed to process chat request")
    }
 }

export const aiexplainconcept = async(concept , context)=>{
const prompt = `Explain the concept of ${concept} based on the following context .provide a clear educational explanation that easy to understand
include examples if relevant
context:${context.substring(0, 10000)}`
try{
   const response = await ai.models.generateContent({
       model:"gemini-2.5-flash-lite",
    contents: prompt
}) 
const generatedtext = response.text
return generatedtext
}

   catch(error){
            console.log("Gemini API error", error)
    throw new Error("Failed to process chat request")
    }
}
