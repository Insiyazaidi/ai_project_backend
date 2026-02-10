import mongoose from "mongoose"
const quizschema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    documentid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"document",
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    questions:[{
        question:{
            type:String,
            required:true

        },
        options:{
            type:[String],
            required:true,
            validate:[array=>array.length===4,"Must have exactly 4 options"]
        },
        correctAnswer:{
            type:String ,
            required:true
        },
        explanation:{
            type:String,
            default:""
        },
        difficulty:{
            type:String,
            enum:["easy", "medium", "hard"],
            default:"medium"
        }
    }] , 
    useranswers:[{
         questionindex:{
            type:Number,
            required:true
        },
        selectedanswer:{
            type:String,
            required:true
        },
        iscorrect:{
            type:Boolean,
            required:true
        },
        answerat:{
            type:Date,
            default:Date.now
        }
    }] , 
    score:{
        type:Number,
        default:0
    },
    totalquestion:{
        type:Number,
        required:true
    },
    completedat:{
        type:Date,
        default:null
    },
    
} , {timestamps:true})
quizschema.index({userid:1 , documentid:1})  // defined an index .. taaki jb hm kisi particular usser ke kisi document ko search krrrhe hoge toh 
// search easy hojaigi
const quiz  = mongoose.model("quiz" , quizschema)
export default quiz