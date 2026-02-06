import express from "express"
import {getflashcards , getallflashcardsets ,  reviewflashcard, togglestarflashcard , deleteflashcardset } from "../controllers/flashcardcontroller.js"
import protect from "../middleware/auth.js"

const flashroute = express.Router()

flashroute.use(protect) // this protect will be used as a middleware for all flashcard route .. no need to write again and again 
flashroute.get("/" , getallflashcardsets)
flashroute.get("/:documentid" , getflashcards)
flashroute.post("/:cardid/review" , reviewflashcard)
flashroute.put("/:cardid/star" , togglestarflashcard)
flashroute.delete("/:id" , deleteflashcardset)
