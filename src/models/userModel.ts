import mongoose, { mongo } from "mongoose";
import Email from "next-auth/providers/email";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String},
    googleId: {type: String}

})

export const User = mongoose.models?.User || mongoose.model("User", userSchema)
