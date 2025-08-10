const mongoose=require("mongoose");
const {Schema,model}=require("mongoose");
const User=require("../models/users");
const Blog=require("../models/blog");
const commentSchema= new Schema({
    content:{
        type:String,
        required:true,
    },
    blog:{
        type:Schema.Types.ObjectId,
        
        ref:"blog",
    },
    userid:{
        type:String,
        ref:"user",

    }
},{timestamps:true});
const Comment=mongoose.model("comment",commentSchema);

module.exports=Comment;
