import Questions from '../models/Questions.js'
import mongoose from 'mongoose'

export const AskQuestion = async (req, res) => {
    const postQuestionData = req.body;
    const userId = req.userId;
    const postQuestion = new Questions({ ...postQuestionData, userId});
    try {
        await postQuestion.save();
        res.status(200).json("Posted a question successfully")
    } catch (error) {
        console.log(error)
        res.status(409).json("Couldn't post a new question")        
    }
}

export const getAllQuestions = async (req, res) => {
    try {
        const questionList = await Questions.find();
        res.status(200).json(questionList);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
} 


 
export const deleteQuestion = async (req,res)=>{
    //parameter avaiable in url is req.params
    const { id:_id } = req.params ;
    
    if(!mongoose.Types.ObjectId.isValid(_id)){
        //too check if valid mongoose id
        return res.status(404).send('question unavailable...');
    }
    try {
        //findByIdAndRemove it will the record with the help of id and it will remove the record from database
        await Questions.findByIdAndRemove( _id );
        res.status(200).json({ message: "successfully deleted..."})

    } catch (error) {
        res.status(404).json({ message: error.message })
    }


}

export const voteQuestion = async (req, res) => {
    const { id: _id } = req.params;
    const { value } = req.body;
    const userId = req.userId;
    
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('question unavailable...');
    }

    try {
        const question = await Questions.findById(_id)
        //find the record based on the id
        const upIndex = question.upVote.findIndex((id) => id === String(userId))
        //finIndex acts as a foeeach loop
        const downIndex = question.downVote.findIndex((id) => id === String(userId))

        if(value === 'upVote'){
            //value is send from frontend 
            if(downIndex !== -1){
                //if i have already downvote then remove from downvote
                question.downVote = question.downVote.filter((id) => id !== String(userId))
                //downvote is array in which we loop through it checks the userid should not  present in the downVote  
                
            } 
            if(upIndex === -1){
                question.upVote.push(userId)
            }else{
                //we remove the vote if already present vote
                question.upVote = question.upVote.filter((id) => id !== String(userId))
            }
        }
        else if(value === 'downVote'){
            if(upIndex !== -1){
                //if i have already upvote then remove from upvote
                question.upVote = question.upVote.filter((id) => id !== String(userId))
            } 
            if(downIndex === -1){
                //new downvote 
                question.downVote.push(userId)
            }else{
                question.downVote = question.downVote.filter((id) => id !== String(userId))
            }
        }
        await Questions.findByIdAndUpdate( _id, question )
        //find by id and then update the record in question
        res.status(200).json({ message: "voted successfully..."})
    } catch (error) {
        res.status(404).json({ message: "id not found"})
    }
}