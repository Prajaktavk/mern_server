
import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
    //Tis file is create for the security purpose
    //the next is if we receive any request from client we will check request has token or not
//the valid or not and then allows the execution of actions
    try {
        const token = req.headers.authorization.split(" ")[1];
        //split the array 

       //test is a secret
        let decodeData = jwt.verify(token, process.env.JWT_SECRET) /*   decoding the token verifying the token */
        req.userId = decodeData?.id 

        next()
    } catch (error) {
        console.log(error)
    }
}

export default auth;