const { ApolloServer } = require('apollo-server')
const gql = require('graphql-tag')
const mongoose = require('mongoose')

const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')
require('dotenv').config({ path: 'variables.env' })

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        return {req}

    }
})


mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected')
    return server.listen({ port: process.env.PORT || 5000 })
}).then(res => {
    console.log(`Server running at ${res.url}`)
}).catch(error => console.log('there has been an error in the connection'))



