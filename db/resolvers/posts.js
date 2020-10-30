const { AuthenticationError, UserInputError } = require('apollo-server')
const { findByIdAndDelete } = require('../../models/Post')
const Post = require('../../models/Post')
const checkAuth = require('../../utils/checkAuth')

const postsResolver = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find({})
                 return posts
            } catch (err) {
                throw new Error(err)
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId).sort({ created_at: -1 })
                if (!post) {
                    throw new Error("The Post does not exists")
                }

                return post

            } catch (err) {
                console.log(err)
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, ctx) {
            console.log('entro en createpost')
            console.log(body)
            const user = checkAuth(ctx)
            if (body.trim() === "") {
                throw new Error("Post body must not be empty")
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                created_at: new Date().toISOString()
            })
            console.log(newPost,'newPost')
            
            const post = await newPost.save()
            return post
        },
        async deletePost(_, { postId }, ctx) {
            const user = checkAuth(ctx)

            try {
                const post = await Post.findById(postId)
                if (!post) {
                    throw new Error('The Post does not exist')
                }

                if (post.user.toString() !== user.id) {
                    throw new Error("You dont have authorization to delete this post")
                }
                await post.deleteOne()
                return "the post has been deleted"

            } catch (e) {
                throw new AuthenticationError("Action not allowed")
            }
        },
        async createComment(_, { postId, body }, ctx) {
            const { username } = checkAuth(ctx)

            if (body.trim() === "") {

                throw new UserInputError("Empty comment", {
                    errors: {
                        body: 'Comment can not be empty'
                    }
                })
            }
            const post = await Post.findById(postId)
            if (!post) {
                throw new Error("The post does not exists")
            }

            post.comments.unshift({
                body,
                username,
                created_at: new Date().toISOString()
            })

            await post.save()
            return post
        },
        async deleteComment(_, { postId, commentId }, ctx) {
            const { username } = checkAuth(ctx)
            const post = await Post.findById(postId)

            if (!post) {
                throw new Error("The post does not exist")
            }

            const commentIndex = post.comments.findIndex(c => c.id === commentId)

            if (!post.comments[commentIndex]) {
                throw new Error("The post comment does not exist")

            }

            if (post.comments[commentIndex].username !== username) {
                throw new AuthenticationError("Unauthorized action")
            }

            post.comments.splice(commentIndex, 1)
            await post.save()
            return post
        },
        async likePost(_, { postId }, ctx) {
            const { username } = checkAuth(ctx)

            const post = await Post.findById(postId)

            if (!post) {
                throw new Error("The post does not exist")
            }
            if (post.likes.find(p => p.username === username)) {
                //Post already liked 
                post.likes = post.likes.filter(like => like.username !== username)
            } else {
                post.likes.push({
                    username,
                    created_at: new Date().toISOString()
                })
                //Post not liked it
            }
            await post.save()

            return post

        }


    }
}

module.exports = postsResolver