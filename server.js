import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url";
import connectdb from "./config/db.js"
import errorhandler from "./middleware/errorhandler.js"
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
app.use(express.urlencoded({extended:true}))
//static folder for uploads
app.use("/uploads" , express.static(path.join(__dirname , "uploads")))

app.use(errorhandler);
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