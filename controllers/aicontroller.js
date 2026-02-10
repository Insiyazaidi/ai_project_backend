import flashcard from "../models/flashcard.js";
import document from "../models/document.js";
import quiz from "../models/quiz.js";
import chathistory from "../models/chathistory.js"
import * as geminiservice from "../utilis/geminiservice.js"  
//   this * means import all named exports
//as geminiservice = un sab ko ek object ka naam de do
import { findrelevantchunks } from "../utilis/textchunker.js";

export const generateflashcards = async(req , res, next)=>{  // client se data lena , db m check krna vo doc present h ya nhi ,
   // geminiservice ko call krna flashcards bnane ke liye , db m store krna .. 
    try{

const {documentid ,  count=10}=req.body;
if(!documentid){
    return res.status(400).json({
        success:false,
        error:"Please provide documentid",
        statuscode:400
    })
}
const fetchdoc =  await document.findOne({_id:documentid , userid:req.user._id , status:"ready"})
if(!fetchdoc){
   return res.status(400).json({
        success:false,
        error:"Document not found or not ready",
        statuscode:400
    })  
}
// console.log(fetchdoc.extractedtext);
const generatedcards = await geminiservice.aiflashcards(fetchdoc.extractedtext , parseInt(count))  // 
// geminiservice.function name is written as we import * as geminiservice so it is used in this way .. 
    const flashcardset = await flashcard.create({  // IMP - FLASHCARD DB M SAVE HUA H YEH SAARE CARDS ... 
        userid:req.user._id,
        documentid: fetchdoc._id ,
        cards: generatedcards.map((card)=>({
            question: card.question,
          answer: card.answer,
          difficulty: card.difficulty
        })
    ),
    reviewcount:0,
    isstarred:false
    }) 
    res.status(201).json({
        success:true , 
        data: flashcardset ,
        message: "Flashcards generated successfully"
    })  
     
    }

    catch(error){
        next(error)
    }
}

export const generatequiz = async (req, res, next) => {
    try {
        const { documentid, numques = 5, title } = req.body;

        if (!documentid) {
            return res.status(400).json({
                success: false,
                error: "Please provide documentid"
            });
        }

        const fetchdoc = await document.findOne({
            _id: documentid,
            userid: req.user._id,
            status: "ready"
        });

        if (!fetchdoc) {
            return res.status(400).json({
                success: false,
                error: "Document not found or not ready"
            });
        }

        const generatedquiz = await geminiservice.aiquiz(
            fetchdoc.extractedtext,
            parseInt(numques)
        );

        if (!generatedquiz.length) {
            return res.status(500).json({
                success: false,
                error: "AI failed to generate valid quiz"
            });
        }

        const quizupdate = await quiz.create({
            userid: req.user._id,
            documentid: fetchdoc._id,
            title: title || `${fetchdoc.title}-Quiz`,
            questions: generatedquiz,
            totalquestion: generatedquiz.length,
            useranswers: [],
            score: 0
        });

        res.status(201).json({
            success: true,
            data: quizupdate,
            message: "Quiz generated successfully"
        });

    } catch (error) {
        next(error);
    }
};

export const generatesummary = async(req , res, next)=>{
    try{

        const {documentid} = req.body;
        if(!documentid){
    return res.status(400).json({
        success:false,
        error:"Please provide documentid",
        statuscode:400
    })
}
        const fetchdoc = document.findOne({_id : documentid , userid: req.user._id , status:"ready" })

           if (!fetchdoc) {
            return res.status(400).json({
                success: false,
                error: "Document not found or not ready"
            });
        }
        console.log(fetchdoc)
        console.log(fetchdoc.extractedtext)

        const gotsummary = await geminiservice.aisummary(fetchdoc.extractedtext)

        
       res.status(200).json({
        success:true ,
        documentid: document._id,
        title: document.title,
        gotsummary
       })

    }
    catch(error){
        next(error)
    }
}
export const chat = async(req , res, next)=>{
    try{

    }
    catch(error){
        next(error)
    }
}
export const explainconcept = async(req , res, next)=>{
    try{

    }
    catch(error){
        next(error)
    }
}
export const getchathistory = async(req , res, next)=>{
    try{

    }
    catch(error){
        next(error)
    }
}