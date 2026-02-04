import document from "../models/document.js";
import flashcards from "../models/flashcard.js"
import quiz from "../models/quiz.js";
import mongoose from "mongoose"
import {extracttextrfrompdf} from "../utilis/pdfparser.js"
import {chunktext} from "../utilis/textchunker.js"
import fs from "fs/promises"
import document from "../models/document.js";

export const uploaddocument = async(req , res , next)=>{
try {
    
if(!req.file){  // multer se object nhi aaya req.file , req.file is the name of object coming from  multer .... 
    return res.status(400).json({
        success:false,
        error:"please upload a pdf file",
        statuscode:400
    })

}
const {title} = req.body  // coming from frontend .. form data 
if(!title){
await fs.unlink(req.file.path)  // req.file object ki property h path usko unlink krdo 
return res.status(400).json({
     success:false,
        error:"please provide a document title",
        statuscode:400
})
}

// construct the base url for the uploaded file
const baseurl = `https://localhost:${process.env.PORT|| 8000}`
const fileurl = `${baseurl}/uploads/documents/${req.file.filename}`

// create document record
const document = await document.create({   // storing in database 
    userid:req.user._id, // req.user is an object coming from protect middleware 
    title,
    filename: req.file.originalname,
    filesize:req.file.size,
    filepath :fileurl,
    status:"processing"
})

 
processpdf(document._id , req.file.path).catch(err=>{
    console.log("pdf  processing error", err)
})
res.status(201).json({
    success:true,
    data:document,
    message:"Document uploaded successfully. Processing in progress..."
})


} 
catch (error) {
    // clean up file on error 
    if(req.file){
        await fs.unlink(req.file.path).catch(()=>{})  // remove file from server// .catch is used if deleting file will give error then catch if and ignore 
    }
    next(error);  // pass an error to Express's error-handling middleware
}



}



 const processpdf= async(documentid , filepath)=>{
    try{
        const {text} = await extracttextrfrompdf(filepath)  // extracttextfrompdf will return an object from that object save the text property .. 
        // create chunk
        const chunks = chunktext(text , 500 , 50)
        // update document
        await document.findByIdAndUpdate(documentid , {
            extractedtext: text,
            chunks:chunks,
            status: "ready"
        })
        console.log(`document ${documentid} processed successfully`)
    }
    catch(error){
 console.error(`Error processing document${documentid}`,error)
 await document.findByIdAndUpdate(documentid,{status:"failed"})
    }
 }





// to get all documents of user 
export const getdocuments = async(req, res , next)=>{

try {
  
    const documents = await document.aggregate(  // applying aggreagte to model name not collection 
        // this will update that particular collection temporary not in db 
        {
        $match:{userid: new mongoose.Types.ObjectId(req.user._id)}
    } ,
{
    $lookup:{  // always return an array , array name is defined in as :" " , this will be automatically added to document temporary 
        from:"flashcards",
        localField:"_id",
        foreignField:"documentid",
        as:"flashcardsets"
    }
},
{
    $lookup:{
        from:"quizzes",
        localField:"_id", // documents collection m field hogi id krke 
        foreignField:"documentid",  // quizzes collection m field hogi document krke 
        as:"quizzes"
        
    }
},
{
    $addfields:{  // add sizes of array flashcardsets , quizzes ... 
        flashcardcount:{$size:"$flashcardsets"}, // {"$flashcardsets"} $ is used so that mongoose understand this is not string it is field name 
        quizcount:{$size:"$quizzes"}
    }
},
{                                                    

  // BEFORE FLASH CARDS ..   
    //  { _id: 111,
 // title: "Math Notes",
 // extractedtext: "Long text data...",
 // chunks: [...],
 // flashcardsets: [ {...}, {...} ],
 // quizzes: [ {...} ],
 // flashcardcount: 2,
 // quizcount: 1
//      }

    $project:{
        extractedtext:0,chunks:0,flashcardsets:0,quizzes:0
    }
},
{
    $sort:{uploaddate:-1}
}

)
res.status(200).json({success:true,count:documents.length , data:documents})
}
 catch (error) {
   
    
    next(error);
}

}

// get single document with chunks 
export const getdocument = async(req, res , next)=>{
    try {


    
}
 catch (error) {
   
    
    next(error);
}


}
export const deletedocument = async(req, res , next)=>{
 try {
    


}
 catch (error) {
   
    
    next(error);
}
    

}
export const updatedocument = async(req, res , next)=>{
    try {
    
        
}
 catch (error) {
   
    
    next(error);
}


}
