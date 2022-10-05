import mongoose from "mongoose";
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";
import { format } from "date-fns";

const commentSchema = new Schema({
    made_by_user: { type: String },
    header: { type: String },
    content: { type: String },
    date_created: { type: String, default: format(new Date(), "yyyy-MM-dd") },
});

export const Comment = mongoose.model("Comment", commentSchema);

const bookSchema = new Schema({
    title: { type: String },
    author: { type: String },
    description: { type: String },
    date_added: { type: String, default: format(new Date(), "yyyy-MM-dd") },
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
    wishlist_array: [bookSchema],
    friend_array: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    friend_array_pending: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    friend_array_requests: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]

});

userSchema.plugin(passportLocalMongoose);

export const User = mongoose.model("User", userSchema);
