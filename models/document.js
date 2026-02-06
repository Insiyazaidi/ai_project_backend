import mongoose from "mongoose";
const documentschema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    } ,
       title:{
        type:String,
        required:[true , "Please provide a document title"], 
        trim:true
    },
    filename:{type:String , required:true},
    filepath:{type:String ,required:true },

    filesize:{type:Number, required:true},
    extractedtext:{type:String , default:""},
    chunks:[{
        content:{
            type:String,
            required:true
        } ,
        pagenumber:{
            type:Number,
            default:0
        },
        chunkindex:{
            type:Number, required:true
        },
        lastaccessed:{
         type:Date,
         default:Date.now
        }
      
    }] ,
        uploaddate:{
        type: Date,
        default: Date.now,
        immutable: true  
    },

  lastaccessed:{
        type:Date,
        default:Date.now
    },

      status:{
            type:String,
            enum:["processing" , "ready" , "failed"],
            default:"processing"
        }

} , {timestamps:true})

documentschema.index({userid:1 , documentid:1})
const document = mongoose.model("document", documentschema)
export default document