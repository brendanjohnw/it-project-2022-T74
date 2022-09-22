import mongoose from "mongoose";
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose'

const commentSchema = new Schema({
    made_by: { type: Schema.Types.ObjectId, ref: "User" },
    made_by_user: { type: String },
    content: { type: String },
    header: { type: String },
    date_created: { type: Date, default: Date.now },
});

export const Comment = mongoose.model("Comment", commentSchema);

const bookSchema = new Schema({
    title: { type: String },
    author: { type: String },
    description: { type: String },
    date_added: { type: Date, default: Date.now },
    genre: { type: String },
    in_wishlist: { type: String },
    rating: { type: Number },
    filename: { type: String },
    img: {
        data: Buffer,
        contentType: String,
    },
    comments: [commentSchema],
});

export const Book = mongoose.model("Book", bookSchema);

const userSchema = new Schema({
    username: { type: String },
    password: { type: String },
    book_array: [bookSchema],
    wishlist_array: [bookSchema]
});
userSchema.plugin(passportLocalMongoose);
export const User = mongoose.model("User", userSchema);
