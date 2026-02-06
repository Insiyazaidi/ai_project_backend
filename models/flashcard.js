import mongoose from "mongoose"
const flashcardschema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    } ,
    documentid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"document",
        required:true
    },
    cards:[
        {
            question:{type:String , required:true},
            answer:{type:String,required:true },
            difficulty:{type:String , enum:["easy", "medium" , "hard"], default:"medium"},
            lastreviewed:{type:Date , default:null},
            reviewcount:{type:Number , default:0},
            isstarred:{type:Boolean , default:false}
        }
    ]
} , {timestamps:true})

flashcardschema.index({userid:1 , documentid:1})
const flashcard = mongoose.model("flashcard" , flashcardschema)
export default flashcard