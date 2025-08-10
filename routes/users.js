const express=require("express");
const User=require("../models/users");
const{matchPassword}=require("../controllers/functions");
const router=express.Router();
router
.post("/signin",async(req,res)=>{
      try{
      const {fullname,email,password} =req.body;
      await User.create({fullname,email,password});
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
});

module.exports=router;