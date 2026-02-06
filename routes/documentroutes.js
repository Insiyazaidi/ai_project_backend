
import express from "express"
import {uploaddocument , getdocuments , getdocument , deletedocument } from "../controllers/documentcontroller.js"
import protect from "../middleware/auth.js";
import upload from "../config/multer.js"
const documentroute = express.Router();


documentroute.use(protect)  // this will allow  all routes to pass through protect before calling a specific function 
documentroute.post("/upload" , upload.single("file"), uploaddocument) 
documentroute.get("/",  getdocuments)  // instead of writing documentroute.get("/", protect ,  getdocuments)  in all other routes also again& again 
documentroute.get("/:id",  getdocument)   // we use documentroute.use(protect)
documentroute.delete("/:id",  deletedocument)


export default documentroute


