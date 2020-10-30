const { AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })


module.exports = (context) => {
 
    const authHeader = context.req.headers.authorization
    
     if (!authHeader) {
        throw new AuthenticationError("Header is not present")
    }

    const token = authHeader.split('Bearer ')[1]
    if (!token) {
        throw new AuthenticationError("Token not provided")
    }

     try {
        const user =  jwt.verify(token, process.env.SECRET_KEY)
        return user
    } catch (error) {
        throw new AuthenticationError("Invalid/expired")
    }

}