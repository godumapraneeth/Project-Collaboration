import Project from "../models/Project.js";

const isParticipant=async (req,res,next)=>{
    try{
        const {roomId}=req.params;
        const project=await Project.findOne({roomId}).populate('participants.user','name email avatar');

        if(!project){
            return res.status(400).json({message:"Project not found"});
        }

        const isUserInProject=project.participants.some(p=>p.user._id.toString()===req.user.id);

        if(!isUserInProject){
            return res.status(403).json({message:"Access denied"});
        }

        req.project=project;
        next()
    }catch(err){
        console.error(err);
        res.status(500).jsin({message:"Server error"});
    }
};

export default isParticipant;