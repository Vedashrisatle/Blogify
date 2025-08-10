const express=require("express");
const router=express.Router();
const multer =require("multer");
const path=require("path");
const Blog =require("../models/blog");
const User =require("../models/users");
const Comment =require("../models/comment");
const { findById } = require("../models/users");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })
router
.get("/add-newblog",(req,res)=>{
    return res.render("addblog",{user:req.user});
})
.post("/new", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body } = req.body;

    const blog = await Blog.create({
      title,
      body,
      createdby: req.user.fullname, // ✅ This sets the author properly
      coverImageUrl: `/uploads/${req.file.filename}`,
      
    });

    res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error("Blog creation failed:", err);
    res.status(500).send("Internal Server Error");
  }
})

.get("/:id",async(req,res)=>{
  const blog=await Blog.findById(req.params.id).populate(req.params._id);
  const allComments=await Comment.find({blog:blog.id});
  const user=await req.user;
  return res.render("blogs",{blog,allComments,user});

})
.post("/comment/:id",async(req,res)=>{
  const {content}=await req.body;

  await console.log(req.user.fullname);
  const blog=await Blog.findById(req.params.id);
  const user=await req.user;
  const comment=await Comment.create({
    content:content,
    blog:blog._id,
    userid:user.fullname,
  });
  
  console.log(comment);
  return res.redirect(`/blog/${blog._id}`);
});


module.exports=router;