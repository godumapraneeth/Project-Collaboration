import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  password:{type:String,required:true},
  avatar:{type:String},
  isVerified:{type:Boolean,default:false},
  verificationToken:{type:String},
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
