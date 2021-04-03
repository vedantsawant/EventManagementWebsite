//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
var path = require("path");
const bodyParser = require("body-parser");
const multer = require('multer');
dotenv.config();


//set up server

const app = express();
var upload = multer();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname,'views')));
app.engine('html', require('ejs').renderFile);
app.listen(PORT,()=> console.log(`Server start at port: ${PORT}`));
app.use(upload.array()); 
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : ["http://localhost:3000"],
    credentials:true
}));
app.get("/test", (req,res)=> {
    res.send("its worked");
});

// connect mongodb

mongoose.connect(process.env.MDB_CONNECT,{
    useNewUrlParser: true,
    useUnifiedTopology:true
},(err)=>{
    if (err) return console.error(err);
    console.log("Connected to mongo");
});

//set routes

app.use("/auth",require("./routers/userRouter"));
app.use("/society",require("./routers/societyRouter"));
app.use("/event",require("./routers/eventRouter"));
app.get("/login",(req,res)=>{
    res.render(__dirname + "/views/login.html")
});
app.get("/home", (req,res)=>{
    res.render(__dirname + "/views/index.html")
});
app.get("/regevent", (req,res)=>{
    res.render(__dirname + "/views/event-form.html")
});