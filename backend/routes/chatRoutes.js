import express from "express";
import Chat from "../models/Chat.js";
import auth from "../middleware/auth.js";
import isParticipant from "../middleware/isParticipant.js";

const router = express.Router();


router.get("/:roomId", auth, isParticipant, async (req, res) => {
  try {
    const chats = await Chat.find({ projectId: req.params.roomId })
      .populate("sender", "name avatar")
      .sort("createdAt");
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:roomId",auth,isParticipant,async(req,res)=>{
  try{
    const newChat=await Chat.create({
      projectId:req.params.roomId,
      sender:req.user._id,
      message:req.body.message,
    });
    const populated=await newChat.populate("sender","name avatar");

    if(req.io){
      req.io.to(req.params.roomId).emit("newMessage",populated);
    }

    res.json(populated);
  }catch(err){
    console.error(err);
    res.status(500).json({message:"Server error"});
  }
})

export default router;