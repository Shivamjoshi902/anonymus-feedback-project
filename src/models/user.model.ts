import mongoose,{ Schema, Document, ObjectId } from "mongoose";

export interface Message extends Document{
    content : String,
    createdAt : Date,
    _id : string
} 

const MessageSchema : Schema<Message> = new Schema(
    {
        content : {
            type : String,
            required : true
        },
        createdAt : {
            type : Date,
            required : true,
            default : Date.now
        },
    }
)

export interface User extends Document{
    userName : String,
    email : String,
    password : string,
    verifyToken : String,
    verifyTokenExpiry : Date,
    isAcceptingMessage : Boolean,
    isVerified : Boolean,
    messages : Message[]
}

const UserSchema : Schema<User> = new Schema(
    {
        userName : {
            type : String,
            required : [true, "userName is reequired"],
            unique : true,
            trim : true
        },
        email : {
            type : String,
            required : [true, "email is reequired"],
            unique : true,
            match: [/.+\@.+\..+/, 'Please use a valid email address'],
        },
        password : {
            type : String,
            required : [true, "password is reequired"],
        },
        verifyToken : {
            type : String,
            required : [true, "verifyToken is reequired"],
        },
        verifyTokenExpiry : {
            type : Date,
            required : [true, "verifyTokenExpiry is reequired"],
        },
        isAcceptingMessage : {
            type : Boolean,
            default : true,
        },
        isVerified : {
            type : Boolean,
            default : false,
        },
        messages : [MessageSchema]
    }
)

const userModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",UserSchema)
export default userModel;