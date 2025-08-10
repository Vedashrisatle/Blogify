const mongoose=require("mongoose");
const {Schema,model}=require("mongoose");
const User=require("../models/users");

const blogSchema=new Schema({
    title:{
        type:String,
        required:true,
       
    },
    body:{
        type:String,
        required:true,
        
    },
    coverImageUrl:{
        type:String,
        required:false,
    },
    createdby:{
    type:String,
    ref:"user",
    }
},   
{timestamps:true});


const Blog=mongoose.model("blog",blogSchema);

module.exports=Blog;