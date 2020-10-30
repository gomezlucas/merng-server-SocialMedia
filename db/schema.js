const { gql } = require('apollo-server')


const typeDefs = gql`

type Post {
    id: ID!
    body: String!
    username: String!
    created_at: String!
    comments: [Comment]!
    likes: [Like]
    likeCount: Int!
    commentCount: Int!
}

type Comment{
 id: ID!
 created_at: String!
 username: String!
 body: String!
}

type Like {
    id: ID!
    created_at: String!
    username: String!
}

type User{
    id: ID!
    email: String!
    token: String!
    username: String!
    created_at: String!
}

input RegisterInput{
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
}

input LoginInput{
    username: String!
    password:String!
}
 
 type Query{
     getPosts: [Post]
     getPost(postId: ID!): Post
 }

 type Mutation{
     registerUser(registerInput: RegisterInput): User!
     loginUser(loginInput: LoginInput): User!
     createPost(body: String!): Post!
     deletePost(postId: ID!):String!
     createComment(postId: ID!, body:String!): Post!
     deleteComment(postId: ID!, commentId:ID!): Post!
     likePost(postId: ID!): Post!
 }
`


module.exports = typeDefs