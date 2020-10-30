const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    created_at: {
        type: String
    },
    comments: [
        {
            body: String,
            username: String,
            created_at: String,
            }
    ],
    likes: [{
        username: String,
        created_at: String,
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },

})


module.exports = mongoose.model('Post', postSchema)
