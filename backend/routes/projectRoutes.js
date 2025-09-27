import express from "express";
import Project from "../models/Project.js";
import User from "../models/User.js";
import crypto from "crypto";
import auth from "../middleware/auth.js";
import isParticipant from "../middleware/isParticipant.js";
import { sendMail } from "../config/nodemailer.js";
import generateRoomId from "../utills/generateRoomId.js";

const router = express.Router();


router.post("/create-room", auth, async (req, res) => {
  try {
    const newProject = await Project.create({
      roomId: generateRoomId(),
      owner: req.user.id,
      participants: [{ user: req.user.id, role: "Owner" }],
      title: req.body.title || "Untitled Project",
    });
    res.status(201).json({ success: true, project: newProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating project" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({ "participants.user": req.user.id }).sort({ updatedAt: -1 });
    res.json({ success: true, projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching projects" });
  }
});

router.post("/accept-invite",auth,async(req,res)=>{
  const {token,roomId}=req.body;

  try{
    const project=await Project.findOne({roomId});
    if(!project) return res.status(404).json({message:"Project not found"});

    const invitation=project.invitations?.find(
      inv=>inv.token ===  token && new Date(inv.expiresAt) > new Date()
    );
    if(!invitation){
      return res.status(400).json({message:"Invalid or expired invitation token"});
    }

    if(invitation.user){
      if(invitation.user.toString()!==req.user.id){
        return res.status(403).json({message:"This invitation in for another user"});
      }
    }

    else if(invitation.email){
      if(invitation.email!==req.user.email){
        return res.status(403).json({message:"This invitation was sent to another email"});
      }
      invitation.user=req.user.id;
    }

    if(!project.participants.some(p=>p.user && p.user.toString()===req.user.id)){
      project.participants.push({user:req.user.id,role:"Editor"});
    }else{
      return res.status(400).json({message:"You are already a participant in the project"});
    }

    project.invitations=project.invitations.filter(inv=>inv.token !== token);

    await project.save();

    res.json({success:true,message:"Invitation accepted successfully!!",project});
  }catch(err){
    console.error(err);
    res.status(500).json({message:"Server error while accepting invitaion"});
  }
})

// Delete a project
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this project" });
    }
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting project" });
  }
});

router.get("/:roomId", auth, isParticipant, (req, res) => {
  res.json({ success: true, project: req.project });
});

router.post("/:roomId/save", auth, isParticipant, async (req, res) => {
  try {
    const { title, html, css, js } = req.body;
    const project = req.project;

    project.title = title ?? project.title;
    project.html = html ?? project.html;
    project.css = css ?? project.css;
    project.js = js ?? project.js;
    
    await project.save();
    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving project" });
  }
});

router.put("/:roomId/update-title", auth, isParticipant, async (req, res) => {
  try {
    const { title } = req.body;
    req.project.title = title || req.project.title;
    await req.project.save();
    res.json({ success: true, project: req.project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating title" });
  }
});


router.post("/:roomId/invite",auth,isParticipant,async(req,res)=>{
  try{
    const {email}=req.body;
    const invitedUser=await User.findOne({email});

    if(invitedUser && req.project.participants.some(p=>{
      const participantId=p.user._id ? p.user._id.toString() : p.user.toString();
      return participantId === invitedUser._id.toString();
    })){
      return res.status(400).json({message:"User is already a participant in the project"})
    }
    const token=crypto.randomBytes(20).toString("hex");
    const expiresAt=Date.now()+24*60*60*1000;
    req.project.invitations.push({
      user:invitedUser ? invitedUser._id:null,
      email,
      token,
      expiresAt
    });
    await req.project.save();

    const acceptLink=`${process.env.CLIENT_URL}/invite/accept?token=${token}&roomId=${req.params.roomId}`;
    await sendMail({
      to:email,
      subject:`You are invited to collaborate on "${req.project.title}"`,
      html:`<p>You have been invited by <dtrong>${req.user.name}</strong> to join the project "<strong>${req.project.title}</strong>" .</p>
      <p><a href="${acceptLink}">Click here to accept</a> .</p>
      <p>This link will expire in 24 hours.</p>`,
    });
    res.json({success:true,message:`Invitation sent to ${email}`});
  }catch(err){
    console.error(err);
    res.status(500).json({message:"Server error"});
  }
});


router.post("/:roomId/leave", auth, isParticipant, async (req, res) => {
  const project = req.project;

  if (project.owner.toString() === req.user.id) {
    return res.status(400).json({ message: "Project owner cannot leave the project. Please delete it instead." });
  }

  try {
    project.participants = project.participants.filter(p => p.user._id.toString() !== req.user.id);
    await project.save();
    res.json({ success: true, message: "You have left the project." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error leaving project" });
  }
});

router.get("/run/:roomId", async (req, res) => {
  try {
    const project = await Project.findOne({ roomId: req.params.roomId });
    if (!project) return res.status(404).send("Project not found");

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${project.title}</title>
          <style>${project.css}</style>
        </head>
        <body>${project.html}</body>
        <script>${project.js}</script>
      </html>
    `;
    res.setHeader("Content-Type", "text/html");
    res.send(htmlContent);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;

