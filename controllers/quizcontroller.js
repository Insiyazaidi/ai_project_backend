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
        success:true , 
        data:quizz
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
const fetchquiz = await quiz.findOne({
    _id : req.params.id,
    userid: req.user.id
})
if(!fetchquiz){
  return  res.status(404).json({
        success: false ,
        error:"quiz not found",
        statuscode: 400
    })
}
if(fetchquiz.completedat){ // default null h toh agr usmai kuch values h 
  return  res.status(404).json({
        success: false ,
        error:"quiz already completed ",
        statuscode: 400
    })
}
// process answer
let correctcount = 0;
const useranswers=[];
answers.forEach(answer=>{// coming from frontend ,  answers ek array of objects h , jismai hr object ki property h questionindex, selected answer  
  //  answers = [
  // {
 //    questionindex: Number,
 //    selectedanswer: String
 //  }
// ]
    const {questionindex , selectedanswer} = answer;  // hr iteration m hm yeh property extract krhe h 
    if(questionindex<fetchquiz.questions.length){ // queestionindex jo userne bheja h vo chota hona chhaiye hmare db m joques savee h uski length se 
        const question = fetchquiz.questions[questionindex]  // db m store ques ko fetch krrhe 
        const iscorrect = selectedanswer===question.correctAnswer // db m stored ques ka answer match krre h selevted answerse 
        if(iscorrect){
    correctcount++;
        }
        useranswers.push({
            questionindex, selectedanswer, iscorrect, answerat: new Date()
        })
    }
})
// calculate score 
const score = Math.round((correctcount/fetchquiz.totalquestion)*100)
fetchquiz.useranswers= useranswers;
fetchquiz.score = score 
fetchquiz.completedat = new Date()
await fetchquiz.save()
res.status(200).json({
    success: true ,
    data:{
        quizid: fetchquiz._id ,
        score ,
        correctcount,
        totalquestions: fetchquiz.totalquestion,
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