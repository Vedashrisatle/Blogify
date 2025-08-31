const express=require("express");
const User=require("../models/users");
const Blog=require("../models/blog");
const Comment=require("../models/comment");
const{matchPassword}=require("../controllers/functions");
const { upload } = require("./cloudinaryConfig");
const { createTokenforUser } = require("../service/authentication");
const router=express.Router();
router
.post("/signin",async(req,res)=>{
      try{
      const {fullname,email,password} =req.body;

      // Create the user account
      const newUser = await User.create({fullname,email,password});

      // Generate JWT token for the new user
      const token = createTokenforUser(newUser);

      // Set the token in cookie
      res.cookie("token", token);

      return  res.redirect("/");
    }catch(error){
        console.log(error);
        res.redirect("/signin");
    }


})
.post("/login",async (req,res)=>{
    
    const {email,password,fullname}=req.body;
try{    const token=await matchPassword(email,password,fullname);
    await res.cookie("token",token);

} catch(error){
   return res.render("login",{error})
}
   
    return res.redirect("/");
})
.get("/logout",async(req,res)=>{
    res.clearCookie("token").redirect("/")
})
.get("/my-blogs",async(req,res)=>{
    if (!req.user) return res.redirect("/signin");
    const user=await req.user;
    console.log('MY BLOGS DEBUG:');
    console.log('req.user:', user);
    console.log('req.user._id:', user._id);
    console.log('req.user._id type:', typeof user._id);

    const userBlogs=await Blog.find({createdby:user._id}).populate("createdby","fullname");

    console.log('Found blogs:', userBlogs.length);
    console.log('Blogs data:', userBlogs);

    return res.render("my-blogs",{user:req.user,userBlogs});
})
.get("/my-comments",async(req,res)=>{
    if (!req.user) return res.redirect("/signin");
    const user=await req.user;
    const userComments=await Comment.find({userid:user._id}).populate("blog","title").populate("userid","fullname");
    return res.render("my-comments",{user,userComments});
})
.get("/edit-profile",async(req,res)=>{
    if (!req.user) return res.redirect("/signin");
    const user=await req.user;
    return res.render("edit-profile",{user});
})
.post("/edit-profile", upload.single("profileImage"), async(req,res)=>{
    if (!req.user) return res.redirect("/signin");
    const user=await req.user;
    const {fullname,email}=req.body;
    const profileImageUrl=req.file ? req.file.path : user.profileImageURL;

    // Update user data in database
    await User.findByIdAndUpdate(user._id,{fullname,email,profileImageURL:profileImageUrl});

    // Fetch updated user data
    const updatedUser = await User.findById(user._id);

    // Create new token with updated data
    const newToken = createTokenforUser(updatedUser);

    // Set new token in cookie
    res.cookie("token", newToken);

    return res.redirect("/");
})
.post("/remove-profile-image", async(req,res)=>{
    if (!req.user) return res.redirect("/signin");
    const user=await req.user;

    // Reset to default profile image
    await User.findByIdAndUpdate(user._id,{profileImageURL:"/image/profile.jpg"});

    // Fetch updated user data
    const updatedUser = await User.findById(user._id);

    // Create new token with updated data
    const newToken = createTokenforUser(updatedUser);

    // Set new token in cookie
    res.cookie("token", newToken);

    return res.render("edit-profile", {
        user: updatedUser,
        success: "Profile image has been successfully removed and reset to default."
    });
})
.delete("/delete-comment/:id", async(req,res)=>{
    if (!req.user) return res.status(401).json({error: "Unauthorized"});
    try {
        const commentId = req.params.id;

        // Find the comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({error: "Comment not found"});
        }

        // Delete the comment directly (since it belongs to the user)
        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({message: "Comment deleted successfully"});
    } catch (error) {
        console.error('DELETE COMMENT ERROR:', error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});

module.exports=router;
