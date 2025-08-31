const express=require("express");
const router=express.Router();
const multer =require("multer");
const path=require("path");
const Blog =require("../models/blog");
const User =require("../models/users");
const Comment =require("../models/comment");
const { findById } = require("../models/users");

const { upload } = require("./cloudinaryConfig");

router
.get("/add-newblog",(req,res)=>{
    if (!req.user) return res.redirect("/signin");
    return res.render("addblog",{user:req.user});
})
.post("/new", upload.single("coverImage"), async (req, res) => {
  if (!req.user) return res.redirect("/signin");
 try {
    const { title, body } = req.body;
    const user=await req.user;
    const newBlog = new Blog({
      title,
      body,
      coverImageUrl: req.file.path, // Cloudinary URL
      createdby: user._id,
    });
    await newBlog.save();
    res.redirect(`/blog/${newBlog._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
})


.get("/:id",async(req,res)=>{
  const blog=await Blog.findById(req.params.id).populate('createdby');
  const allComments=await Comment.find({blog:blog.id}).populate('userid');
  const user=req.user;
  return res.render("blogs",{blog,allComments,user});

})


.post("/comment/:id",async(req,res)=>{
  if (!req.user) return res.redirect("/signin");
  const {content}=req.body;
  console.log(content)
  const user=await req.user;
  const blog=await Blog.findById(req.params.id);
  const comment=await Comment.create({
    content:content,
    blog:blog._id,
    userid:user._id,
  });

  return res.redirect(`/blog/${blog._id}`);
})
.delete("/delete/:id", async (req, res) => {
  if (!req.user) return res.redirect("/signin");
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    // Delete all comments associated with this blog
    await Comment.deleteMany({ blog: req.params.id });

    // Delete the blog itself
    await Blog.findByIdAndDelete(req.params.id);

    return res.status(200).send("Blog and all its comments deleted successfully");
  } catch (err) {
    console.error('DELETE ERROR:', err);
    return res.status(500).send("Internal Server Error");
  }
});


module.exports=router;
