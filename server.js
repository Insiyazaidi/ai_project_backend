import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url";
import connectdb from "./config/db.js"
import authroute from "./routes/authroutes.js";
import documentroute from "./routes/documentroutes.js";
import flashroute from "./routes/flashcardroutes.js"
import airoute from "./routes/airoutes.js";
import quizroute from "./routes/quizroutes.js";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express();
//Connect to mongodb
connectdb();
// middleware 
app.use(
    cors(
        {
            origin:"*",
            methods:["GET", "POST" , "PUT" , "DELETE"],
            allowedHeaders:["Content-Type" , "Authorization"],
            credentials:true,
        }
    )
)

app.use(express.json());  // to make use of json in future 
 app.use("/api/user" , authroute);
app.use("/api/documents" , documentroute);
app.use("/api/flash" , flashroute)
app.use(express.urlencoded({extended:true})) // to read data from html form 
//static folder for uploads
app.use("/uploads" , express.static(path.join(__dirname , "uploads")))  // express.static is used to show file from upload folder 

// ai_project/backend/uploads - will be public when we req on uploads url 

app.use("/api/airoute" , airoute)

app.use("/api/quiz" , quizroute)
// ROutes 
//404
app.use((req,res)=>{
    res.status(404).json({sucess:false , error:"Route not found" , statuscode:404})

})

// start server
const PORT = process.env.PORT||8000;
app.listen( PORT , ()=>{
 console.log(`server started ${process.env.NODE_ENV} node on port ${PORT}`)
 });

 process.on("unhandledRejection" , (err)=>{
    console.error(`error:${err.message}`);
    process.exit(1);
 })