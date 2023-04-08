import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import userRoutes from './routes/users.js'
import dotenv from 'dotenv'
import questionRoutes from './routes/Questions.js'
dotenv.config();
// in node we have to write users.js
import answerRoutes from './routes/Answers.js'
const app = express();
//to create a express server
app.use(express.json({limit: "30mb", extended: true}))
app.use(express.urlencoded({limit: "30mb", extended: true}))
app.use(cors());

app.get('/',(req, res) => {
    //this a response send to the client, this is printed on the browser
    res.send("This is a stack overflow clone API")
})
mongoose.set('strictQuery', false);

app.use('/user',userRoutes)

app.use('/questions',questionRoutes)

app.use('/answer',answerRoutes)

const PORT = process.env.PORT || 5000

const DATABASE_URL = process.env.CONNECTION_URL

mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => {console.log(`server running on port ${PORT}`)}))
    .catch((err) => console.log(err.message))







 