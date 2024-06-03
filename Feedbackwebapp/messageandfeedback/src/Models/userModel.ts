import mongoose, { Schema } from "mongoose";
export interface Message extends Document {
    _id: String;
    content: String;
    createdAt : Date;
}

export interface User extends Document {
    _id: String;
    username: String;
    email: String;
    password: String;
    createdAt : Date;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isAcceptedMessage : boolean;
    isVerified : boolean;
    messages : Message[];
}

const messageSchema : Schema<Message> = new Schema({

  content  : {
    type : String,
    required : true
  },
  createdAt : {
    type : Date,
    required : true,
    default : Date.now
  }
})

const userSchema : Schema<User> = new Schema ({
    username : {
        type : String,
        required : true,
        unique : true,
        trim:true
    },
    email : {
        type : String,
        required : [true,"Email is required"],
        unique : true,
        match : [/+\-@-/,'please provide valide email address']
    },
    password : {
        type : String,
        required : [true,"Password is Required"]
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    },
    verifyCode : {
        type : String,
        required : true
    },
    verifyCodeExpiry : {
        type : Date,
        required : true
    },
    isAcceptedMessage : {
        type : Boolean,
        required : true,
        default : false
    },
    messages : {
        type : [messageSchema],
        required : true,
    },
    isVerified : {
        type : Boolean,
        required : true,
        default : false
    }
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",userSchema)

export default UserModel;