import document from "../models/document.js";
import flashcard from "../models/flashcard.js"
import quiz from "../models/quiz.js";
import mongoose from "mongoose"
import {extracttextrfrompdf} from "../utilis/pdfparser.js"
import {chunktext} from "../utilis/textchunker.js"
import fs from "fs/promises"


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
const baseurl = "https://synaply.onrender.com"
const fileurl = `${baseurl}/uploads/documents/${req.file.filename}`
console.log(fileurl)

// create document record
const documents = await document.create({   // storing in database 
    userid:req.user._id, // req.user is an object coming from protect middleware 
    title,
    filename: req.file.filename,
    filesize:req.file.size,
    filepath :fileurl,
    status:"processing"
})
processpdf(documents._id , req.file.path).catch(err=>{
    console.log("pdf  processing error", err)
})  

res.status(201).json({
    success:true,
    data:documents,
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
 console.error(`Error processing document ${documentid}`,error)
 await document.findByIdAndUpdate(documentid,{status:"failed"})
    } 

}
// to get all documents of user 
export const getdocuments = async(req, res , next)=>{

try {
  
    const documents = await document.aggregate( [ // applying aggreagte to model name not collection 
        // this will update that particular collection temporary not in db 
        {
        $match:{userid: new mongoose.Types.ObjectId(req.user._id)}
    } ,
{
    $lookup:{  // always return an array , array name is defined in as :" " , this will be automatically added to document temporary 
        from:"flashcards",  // collection name not a model name 
        localField:"_id",
        foreignField:"documentid",
        as:"flashcardsets"
    }
},
{
    $lookup:{
        from:"quizzes",  // collection name not a model name 
        localField:"_id", // documents collection m field hogi id krke 
        foreignField:"documentid",  // quizzes collection m field hogi document krke 
        as:"quizzes"
        
    }
},
{
    $addFields:{  // add sizes of array flashcardsets , quizzes ... 
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

])
res.status(200).json({success:true,count:documents.length , data:documents})
}
 catch (error) {
   
    
    next(error);
}

}



// get single document with chunks 
export const getdocument = async(req, res , next)=>{
    try {
const particulardoc = await document.findOne({  // we could have used just document id to search but in case some othe ruser try to access doc of 
    // someone else ...   
    _id:req.params.id,  // URL wala id
    userid:req.user._id // currently logged in user 
})

if(!particulardoc){
    return res.status(404).json({
        success:false,
        error:"document not found",
        statuscode: 404
    })
}

// get couunt of associated flashcards and quizzes ...  
const flashcardcount = await flashcard.countDocuments({documentid:particulardoc._id , userid: req.user._id}) // countDocument is a method just like findOne 
const quizcount = await quiz.countDocuments({documentid: particulardoc._id , userid:req.user._id})
// update last accessed 
particulardoc.lastaccessed = Date.now()
await particulardoc.save()
//combine document data with counts 
const documentdata = particulardoc.toObject()  //  backend se Mongoose Document instance ata h we want to convert into plain js object 
documentdata.flashcardcount = flashcardcount  //  Jab document fetch ho, tab uske kitne flashcards hain woh bhi mile bt hmne schema m toh 
//  aise kuch define nhi kiya h .. isliye hm usko normaljs m convert kkre field add krrhe h temp 
  documentdata.quizcount = quizcount
  
  res.status(200).json({
    success:true , 
    data: documentdata
  })
}

 catch (error) {
    next(error);
}


}


export const deletedocument = async(req, res , next)=>{
 try {
   const deletingdoc  = await document.findOne({  
    // someone else ...   
    _id:req.params.id,  
    userid:req.user._id 
}) 
if(!deletingdoc){
    return res.status(404).json({
        success:false,
        error:"document not found",
        statuscode: 404
    })
}
// deleting file from filesystem 
 await fs.unlink(deletingdoc.filepath).catch(()=>{})  // filepath jo db m store h vha se liya h 

await deletingdoc.deleteOne()
res.status(200).json({
     success:true , 
     message: "document deleted successfully"
})
}
 catch (error) {   
    next(error);
}
}



