import document from "../models/document.js";
import flashcards from "../models/flashcard.js"
import quiz from "../models/quiz.js";
import mongoose from "mongoose"
import {extracttextrfrompdf} from "../utilis/pdfparser.js"
import {chunktext} from "../utilis/textchunker.js"
import fs from "fs/promises"

export const uploaddocument = async(req , res , next)=>{
try {
    
} catch (error) {
    // clean up file on error 
    if(req.file){
        await fs.unlink(req.file.path).catch(()=>{})
    }
    next(error);
}
}

// to get all documents of user 
export const getdocuments = async(req, res , next)=>{

}

// get single document with chunks 
export const getdocument = async(req, res , next)=>{
    
}
export const deletedocument = async(req, res , next)=>{
    
}
export const updatedocument = async(req, res , next)=>{
    
}
