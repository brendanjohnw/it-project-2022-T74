
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
    username : {type: String},
    password: {type: String},
})

const User = mongoose.model('User', userSchema)
export default User
