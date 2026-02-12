import quiz from "../models/quiz.js"
export const getquizzes = async(req, res, next)=>{
    try{
const quizzes =  await quiz.find({
    userid: req.user._id,
    documentid: req.params.documentid
}).populate("documentid" , "title filename").sort({createdAt:-1}) // Jis field ka naam documentid hai, usko populate karo using its ref model.
res.status(200).json({
    success: true,
    count:quizzes.length,
    data:quizzes
})
    }

    catch(error){
        next(error)
    }
}
export const getquizbyid = async(req, res, next)=>{ // particular user ka particular quiz 
    try{
const quizz = await quiz.findOne({
    _id: req.params.id,
    userid: req.user._id
})
if(!quizz){
    return res.status(400).json({
        success:false , 
        error:"quiz not found",
        statuscode:404
    }) 
}
  res.status(200).json({
        success:false , 
        data:quiz
    })

    }

    catch(error){
        next(error)
    }
}
export const submitquiz = async(req, res, next)=>{
    try{
const answers = req.body.answers;
if(!Array.isArray(answers)){
    res.status(400).json({
        success: false ,
        error:"Please provide answer array",
        statuscode: 400
    })
}
const quiz = await quiz.findOne({
    _id : req.params.id,
    userid: req.user.id
})
if(!quiz){
  return  res.status(404).json({
        success: false ,
        error:"quiz not found",
        statuscode: 400
    })
}
if(quiz.completedat){ // default null h toh agr usmai kuch values h 
  return  res.status(404).json({
        success: false ,
        error:"quiz already completed ",
        statuscode: 400
    })
}
// process answer
let correctcount = 0;
const useranswers=[];
answers.forEach(answer=>{
    const {questionindex , selectedanswer} = answer;
    if(questionindex<quiz.questions.length){
        const question = quiz.questions[questionindex]
        const iscorrect = selectedanswer===question.correctanswer
        if(iscorrect){
    correctcount++;
        }
        useranswers.push({
            questionindex, selectedanswer, iscorrect, answerat: new Date()
        })
    }
})
// calculate score 
const score = Math.round((correctcount/quiz.totalquestions)*100)
quiz.useranswers= useranswers;
quiz.score = score 
quiz.completedat = new Date()
await quiz.save()
res.status(200).json({
    success: true ,
    data:{
        quizid: quiz._id ,
        score ,
        correctcount,
        totalquestions: quiz.totalquestions,
        percentage: score ,
        useranswers
    },
    message:"Quiz submitted successfully"
})
    }

    catch(error){
        next(error)
    }
}
export const getquizresults = async(req, res, next)=>{
    try{

    }

    catch(error){
        next(error)
    }
}
export const deletequiz = async(req, res, next)=>{
    try{

    }

    catch(error){
        next(error)
    }
}