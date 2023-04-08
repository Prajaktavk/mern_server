import mongoose from 'mongoose'
import users from '../models/auth.js'

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await users.find();
        //finding the user from database
        const allUserDetails = []
       // empty array 
        allUsers.forEach(user => {
            //this will be pushed in userdetails and it will be send to frontend
            allUserDetails.push({ _id: user._id, name: user.name, about: user.about, tags: user.tags, joinedOn: user.joinedOn })
        })
        res.status(200).json(allUserDetails);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

 export const updateProfile = async (req, res) => {
    const { id: _id } = req.params;
    const { name, about, tags } = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('question unavailable...');
    }

    try {
        //new true  is used to return the updated record if we dont write new true then the previous record  updated will be returned
        const updatedProfile = await users.findByIdAndUpdate( _id, { $set: { 'name': name, 'about': about, 'tags': tags }}, { new: true } )
        res.status(200).json(updatedProfile)
        /* update profile will be send to the frontend */
    } catch (error) {
        res.status(405).json({ message: error.message })
    }
}