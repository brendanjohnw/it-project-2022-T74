
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const bookSchema = new Schema({
    title: { type: String },
    author: { type: String },
    price: { type: String },
    date_added: { type: String },
    wishlist: { type: Boolean },
    rating: { type: Number },
    img:
    {
        data: Buffer,
        contentType: String
    }
})

export const Book = mongoose.model('Book', bookSchema)


const userSchema = new Schema({
    username: { type: String },
    password: { type: String },
    book_array: [bookSchema]
})

export const User = mongoose.model('User', userSchema)


const commentSchema = new Schema({
    made_by: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    comment: { type: String }
})

export const Comment = mongoose.model('Comment', commentSchema)




