import document from "../models/document.js"
import flashcard from "../models/flashcard.js"
import quiz from "../models/quiz.js"

export const getdashboard = async(req, res,next)=>{
try {
    const userid = req.user._id
    const totaldocuments = await document.countDocuments({userid})
    const totalflashcardsets = await flashcard.countDocuments({userid})
    const totalquizzes = await quiz.countDocuments({userid})
    const completedquizzes = await quiz.countDocuments({userid , completedat:{$ne:null}})
    const flashcardsets = await flashcard.find({userid})
    let totalflashcards =0;
    let reviewedflashcards=0;
    let starredflashcards=0;
    flashcardsets.forEach(set=>{
        totalflashcards+=set.cards.length
        reviewedflashcards+=set.cards.filter(c=>c.reviewcount>0).length
        starredflashcards+= set.cards.filter(c=>c.isstarred).length
    })
    const quizzes = await quiz.find({userid , completedat:{$ne: null}})
    const averagescore = quizzes.length>0?Math.round(quizzes.reduce((sum,q)=>sum+q.score,0)/ quizzes.length):0
const recentdocuments = await document.find({userid}).sort({lastaccessed:-1}).limit(5).select("title filename lastaccessed status")
const recentquizzes = await quiz.find({userid}).sort({createdat:-1}).limit(5).populate("documentid" , "title").select("title score totalquestion completedat")
const studystreak = Math.floor(Math.random*7)+1
res.status(200).json({
    success: true,
    data:{
        totaldocuments, totalflashcards , totalflashcardsets, reviewedflashcards, starredflashcards , totalquizzes , 
        completedquizzes ,averagescore, studystreak
    },
    recentactivity:{
        documents: recentdocuments , quizzes: recentquizzes
    }
})



} catch (error) {
    next(error) 
}
}