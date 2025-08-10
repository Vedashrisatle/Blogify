const mongoose=require("mongoose");
const{createHmac,randomBytes}=require("crypto");
const userSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    profileImageURL:{
        type:String,
        default:"/image/profile.jpg"
    },
    role:{
        type:String,
        default:"User",
    }
    

});



userSchema.pre("save",function(next){
 const user=this;
 if(!user.isModified("password"))return;
 const salt=randomBytes(16).toString();
 const Hashedpassword=createHmac('sha256',salt).update(user.password).digest("hex");

 this.salt=salt;
 this.password=Hashedpassword;
 next();


});

const User=mongoose.model("user",userSchema);

module.exports=User;