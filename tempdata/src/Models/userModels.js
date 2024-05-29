import { verify } from 'crypto'
import mongoose from 'mongoose'
 
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true,"please provide your username"],
        unique: true,

    },

    email:{
        type: String,
        required: [true,"please provide your email"],
        unique: true,
    },
    password:{
        type: String,
        required: [true,"please provide your password"],
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    forgetPasswordToken: String,
    forgetPasswordTokenExpiry : Date,
    verifyToken : String,
    verifyTokenExpiry : Date,
})
let User = mongoose.models.users || mongoose.model("users",userSchema)
export default User;