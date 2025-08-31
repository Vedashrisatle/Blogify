require("dotenv").config(); // Load .env variables


const express=require("express");
const path=require("path");
const cookieParser = require('cookie-parser')
const {connectMongoDb}=require("./connection/connectMongoDb");
const User=require("./models/users");
const staticRouter=require("./routes/staticRouter");
const userRouter=require("./routes/users");
const blogRouter=require("./routes/blog");

const{checkAuth}=require("./middleware/checkAuth");

const PORT=8004;
const app=express();

app.use(express.static(path.resolve("./public")));
app.use(express.static(path.resolve("/image")));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
connectMongoDb(process.env.MONGODB_URI);

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(checkAuth("token"));

app.use("/",staticRouter);
app.use("/user",userRouter);
app.use("/blog",blogRouter);



app.listen(PORT,()=>{
    console.log(`Server started at : ${PORT}`);
});

module.exports = app;
