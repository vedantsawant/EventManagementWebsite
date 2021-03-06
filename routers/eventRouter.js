const router = require("express").Router();
const Society = require("../models/sbodyModel");
const User = require("../models/userModel");
const Event = require("../models/EventModel");
const jwt = require("jsonwebtoken");
const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/eventposters/');
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

const upload = multer({
    storage
});


router.route("/add").post(async (req,res,next)=>{

    try {
        const {eventname, description,sbodyid,eventdate,venue} = req.body;
        
        const token = req.cookies.token;
        // const postername=req.body.postername;
        // var imageData = req.file.path;
        // imageData = imageData.replace(/\\/g,"/");
        // imageData = imageData.slice(7);
        
        
        if(!token) return res.json("no token");
        
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        if(!verified) return res.json("no verified");
        
        const user = await User.findById(verified.user);
        if(!user) return res.json("no user");
        
        let society = await Society.findById(sbodyid);
        
        
        var validuser =0
        if(!society){
            return res.json("no scoiety");
        }
        console.log(society);
        for (var i = 0;i<society.staff.length;i++){
            console.log(society.staff[i].uid === user._id);
            console.log(String(society.staff[i].uid));
            if(String(society.staff[i].uid) === String(user._id)){
                console.log("here");
                validuser = 1;
            }
        }
        console.log(validuser);
        if(validuser===0){
            return res.json("no valid user");
        }

        if(!sbodyid || !description || !eventname ||! eventdate ||! venue)
            return res.status(400).json({errorMessage:"Please Enter all Required fields"});
        const newEvent = new Event({
            sbodyid, eventdate,eventname,description,venue
        });
        const savedEvent = await newEvent.save();
        res.status(200).send("done");

        


    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
    
});

router.get("/getall", async (req, res) => {
    try {
        var events = await Event.find({});
        for (var i = 0;i<events.length;i++){
            sid = events[i].sbodyid;
            let society = await Society.findById(sid);
            events[i]["societyname"] = society.sbodyname;
            events[i]["type"] = society.type;
            
        }
        
        res.send(events);

        


    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
    
});
router.post("/register", async (req, res) => {
    try {
        const {eventid, uid} = req.body;


        const event = await Event.findById(eventid);
        event.registered.push(uid)
        const savedEvent = await event.save();
        res.status(200).send("done");



    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
    
});


module.exports =router;