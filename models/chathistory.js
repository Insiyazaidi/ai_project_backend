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
                
            }
        ]
})