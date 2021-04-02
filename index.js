const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();

//set up server

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=> console.log(`Server start at port: ${PORT}`));

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