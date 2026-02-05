import multer from "multer" 
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)  // __filename = ai_project/backend/config/multer.js
const __dirname = path.dirname(__filename)  //__dirname = ai_project/backend/config
const uploaddir = path.join(__dirname , "../uploads/documents")  // ../ will make u move out of config folder and join -ai_project/backend/upload/document  
if(!fs.existsSync(uploaddir)){  // Even agar uploads bhi nahi hai             
    fs.mkdirSync(uploaddir, {recursive:true})  // Toh {recursive:true} dono folders bana dega
}

// configure storage 
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{   // where to store file - 
        cb(null, uploaddir)   // cb(error , destination name ) -  so here cb(null , uploaddir )
    },
    filename:(req, file,cb)=>{
        const uniquesuffix = Date.now()+'-'+Math.round(Math.random()*1E9) //Date.now- current time in millisec , math.random generate random 
        // number btw 0-1 multily that no, round of krdo  that  will be unique suffix 
        cb(null , `${uniquesuffix}-${file.originalname}`)   // final filename will be combination 
    }
})

// file filter - only pdf 
const filefilter = (req,file,cb)=>{
    if(file.mimetype==="Application/pdf"  ){
        cb(null , true)
    }
    else{
        cb(new Error("Only pdf files are allowed"), false)
    }
}
const upload = multer({
    storage:storage,
    fileFilter:filefilter,
    limits:{
        fileSize: parseInt(process.env.MAX_FILE_SIZE)|| 10485760
    }
})
export default upload