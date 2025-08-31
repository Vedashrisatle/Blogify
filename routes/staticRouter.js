const express=require("express");
const Blog = require("../models/blog");
const Comment =require("../models/comment");

const router=express.Router();
router
.get("/login",(req,res)=>{
    return res.render("login");
})
.get("/signin",(req,res)=>{
    return res.render("signin");
})
.get("/",async (req,res)=>{
    const allBlogs= await Blog.find({}).populate("createdby","fullname profileImageURL");
    const user=await req.user;

    return res.render("homepage",{user,allBlogs});
})
.get("/posts",async(req,res)=>{
    const allBlogs= await Blog.find({}).populate("createdby","fullname profileImageURL");
    const user=await req.user;
    return res.render("posts",{user,allBlogs});
})
.get("/about",async(req,res)=>{
    const user=await req.user;
    return res.render("about",{user})
});

module.exports=router;

