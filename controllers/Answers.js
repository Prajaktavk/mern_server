import mongoose from 'mongoose'
import Questions from '../models/Questions.js'

export const postAnswer = async(req, res) => {
    const { id: _id } = req.params;
    const { noOfAnswers, answerBody, userAnswered } = req.body;
    const userId = req.userId;
   
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('question unavailable...');
    }
    
    updateNoOfQuestions(_id, noOfAnswers)
    
     //mongoose gives each  record a is based on that we can identify the record

    try {
    //the query updates the answer in the database based on the userId it identifies the user and then in that it updates the answer
    const updatedQuestion = await Questions.findByIdAndUpdate( _id, { $addToSet: {'answer': [{ answerBody, userAnswered, userId }]}})
        res.status(200).json(updatedQuestion)

    } catch (error) {
        res.status(400).json('error in updating')
    }
}

const updateNoOfQuestions = async (_id, noOfAnswers) => {
try {
    //to update the no.of answers in the database this query is used 
    await Questions.findByIdAndUpdate( _id, { $set: { 'noOfAnswers' : noOfAnswers}})
} catch (error) {
    //res.status(200) this not used here because we are sending any response we are just updating the no,ofanswers
    //therefore we write console.log(error)
    console.log(error)
}
}

export const deleteAnswer = async ( req, res ) => {
    const { id:_id } = req.params;
    
    const { answerId, noOfAnswers } = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('Question unavailable...');
    }
    if(!mongoose.Types.ObjectId.isValid(answerId)){
        return res.status(404).send('Answer unavailable...');
    }
    updateNoOfQuestions( _id, noOfAnswers)
    try{
        //updating the only the deleted one
        await Questions.updateOne(
            { _id }, 
            //pull property matches the in the database and then pulls the record from database and updates the questions page
            { $pull: { 'answer': { _id: answerId } } }
        )
        res.status(200).json({ message: "Successfully deleted..."})
    }catch(error){
        res.status(405).json(error)
    }
}