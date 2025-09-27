import mongoose from "mongoose";


const versionSchema = new mongoose.Schema({
  html: String,
  css: String,
  js: String,
  createdAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
  roomId: { type: String, required: true, index: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participants:[
    {
      user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
      role:{type:String,enum:["Owner","Editor","Viewer"],default:"Editor"}
    }
    ],
  invitations:[
    {
      user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
      token:String,
      expiresAt:Date
    }
  ],
  title: String,
  html: String,
  css: String,
  js: String,
  versions: [versionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Project", projectSchema);
