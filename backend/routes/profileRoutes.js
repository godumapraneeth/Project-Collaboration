import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router=express.Router()

// GET profile
router.get("/", auth, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// UPDATE profile
router.put("/", auth, async (req, res) => {
  try {
    const { name, avatar } = req.body;

    if (name) req.user.name = name;
    if (avatar) req.user.avatar = avatar;

    await req.user.save();

    res.json({ success: true, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;