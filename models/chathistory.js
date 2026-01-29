import mongoose from "mongoose"
const chathistoryschema =  new mongoose.Schema({
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
        messages:[
            {
                role:{
                    type:String,
                    enum:["user" , "assistant"],
                    required:true
                } ,
                content:{
                    type:String,
                    required:true
                },
                timestamps:{
                    type:Date,
                    default:Date.now
                },
                relevantchunks:{
                    type:[Number],
                    default:[]
                }
            }
        ]
} , {timestamps:true})
chathistoryschema.index({userid:1 , documentid:1})
const chathistory=mongoose.model("chathistory" , chathistoryschema)
export default chathistory