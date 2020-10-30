const { UserInputError } = require('apollo-server')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

const User = require('../../models/User')
const { registerValidators, validateLogin } = require('../../utils/validators')
require('dotenv').config({ path: 'variables.env' })



const createToken = (id, email, username) => {
    const token = jwt.sign({
        id,
        email,
        username
    },
        process.env.SECRET_KEY,
        {
            expiresIn: '24h'
        }
    )
    return token
}


const usersResolver = {
    Mutation: {
        async registerUser(_, { registerInput }, ctx) {

             const { username, email, password, confirmPassword } = registerInput
            // make sure it doesnt already exists
            const user = await User.findOne({ username })

            if (user) {
                throw new UserInputError("Username already taken", {
                    errors: {
                        username: "Username already taken"
                    }
                })
            }
            // validate data
            const { errors, valid } = registerValidators(
                username,
                email,
                password,
                confirmPassword)

            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            // hash password 
            const hashedPass = await bcrypt.hash(password, 12)
            const newUser = new User({
                email,
                username,
                password: hashedPass
            })

            const response = await newUser.save()

            const token = createToken(response._id, email, username)
             return {
                id: response._id,
                token,
                username
            }
        },
        async loginUser(_, { loginInput }) {
            const { username, password } = loginInput

            // validate that they are not empty
            const { errors, valid } = validateLogin(username, password)

            if (!valid) {
                throw new UserInputError("Errors", { errors })
            }

            //verify if user exists
            let user = await User.findOne({ username })


            if (!user) {
                errors.general = 'Username does not exists in our database'
                throw new UserInputError("Username does not exists in our database", {
                    errors
                })
            }
            // check if password is correct
            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                errors.general = "Password is incorrect"
                throw new UserInputError("Password is incorrect", {
                    errors
                })
            }
            //create token
            const token = createToken(user._id, user.email, username)
            return {
                id: user._id,
                token,
                username
            }
        }
    }

}


module.exports = usersResolver