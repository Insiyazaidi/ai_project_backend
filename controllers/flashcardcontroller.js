
import flashcard from "../models/flashcard.js";
 export const getflashcards = async(req,res,next)=>{  // ek particular user ke ek document ke flashcards nikalo ... 
    try{
  const flashcards = await flashcard.find({
    userid : req.user._id,  // coming from protect middleware who returns ans object nmes req.user containing info abt user 
    documentid: req.params.documentid  // coming from url 
  })
.populate("documentid" , " title filename ").sort({createdAt:-1})  // flashcard schema dont have info abt document title or filename we need to make 
// use of document schema toh add title and filename temp for response 
res.status(200).json({
    success:true , 
    count:flashcards.length,
    data:flashcards
})
    }
    catch(error){
  next(error)
    }
}
   export  const getallflashcardsets = async(req,res,next)=>{
    try{ // us particular user ke saare flashcards .. 
   const flashcardsets = await flashcard.find({userid: req.user._id }).populate("documentid" , "title").sort({createdAt:-1})  
 // Using populate we convert the documentid field (which is an ObjectId) into an object containing _id and title from the document schema — in the response
   //   "documentid": {
       // "_id": "doc1",
      //  "title": "DBMS Notes"
      // }
   res.status(200).json({
    success: true , count: flashcardsets.length , data: flashcardsets
   })   


    }
    catch(error){
  next(error)
    }
}

// "Jo user login hai, uske flashcard sets me se wo set do jisme ye card exist karta ho."
  export  const reviewflashcard = async(req,res,next)=>{
    try{
const flashcardset= await flashcard.findOne({  // yeh pura vo particular flashcard set return krega 
     "cards._id": req.params.cardid,   // "cards._id" aise isliye likha kyu ki flashcardset m yeh direct thodi card id given h 
     // vo toh card ka jo  array h usmai hr card ki id define h   
     // ._id isliye kyu ki hr ek card ki internally id genereate hogi by mongoose        
    userid: req.user._id
})

if(!flashcardset){
    return res.status(400).json({success:false ,  error: "flashcard set or card not found" , statuscode: 404} )
}

const cardindex = flashcardset.cards.findIndex(card=> card._id.toString()=== req.params.cardid) // card array pr jao aur yeh condition true hogi toh 
// us card ka index de dena 
if(cardindex=== -1){
    return res.status(404).json({
        success: false , 
        error: "Cards not found in set",
        statuscode : 404 
    })
   
}
 // update review info
    flashcardset.cards[cardindex].lastreviewed = new Date()  // flashcardset ke andr card array hoga uska index 4 ki property lastreviwed change krdo
    flashcardset.cards[cardindex].reviewcount+=1;
    await flashcardset.save()
    res.status(200).json({
        success: true , 
        data : flashcardset,
        message: "flashcard reviewed successfully "
    })
    }


    catch(error){
  next(error)
    }
}

// ek user ke flashcard set m se ek card pick kro aur usko star ya unstar krdo 
 export  const togglestarflashcard = async(req,res,next)=>{
    try{
const flashcardset = await flashcard.findOne({
    "cards._id": req.params.cardid,
    userid: req.user._id
})

if(!flashcardset){
    return res.status(400).json({success:false ,  error: "flashcard set or card not found" , statuscode: 404} )
}
const cardindex = flashcardset.cards.findIndex(card=> card._id.toString()=== req.params.cardid) 
if(cardindex=== -1){
    return res.status(404).json({
        success: false , 
        error: "Cards not found in set",
        statuscode : 404 
    })
   
}
flashcardset.cards[cardindex].isstarred= !flashcardset.cards[cardindex].isstarred  // starred h toh unstarred hojiaga and vice versa 
await flashcardset.save()
  res.status(200).json({
        success: true , 
        data : flashcardset,
        message:`flashcard ${flashcardset.cards[cardindex].isstarred ? "starred": "unstarred"}`
    })
    }
    catch(error){
  next(error)
    }
}
 export  const deleteflashcardset = async(req,res,next)=>{
    try{

        const flashcardset = await flashcard.findOne({
            _id: req.params.id,  // flashcard set ki id aarhi h 
            userid: req.user._id
        })

if(!flashcardset){
  return res.status(404).json({
        success: false , 
        error: "flashcard set not found ",
        statuscode : 404 
    })  
}
await flashcardset.deleteOne()
res.status(200).json({
    success: true , 
    message: " flashcard set deleted sccessfully"
})
    }
    catch(error){
  next(error)
    }
}