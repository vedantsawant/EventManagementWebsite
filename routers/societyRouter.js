const router = require("express").Router();
const Society = require("../models/sbodyModel");
const User = require("../models/userModel");
const Event = require("../models/EventModel");

router.post("/add", async (req, res) => {
    try {
        const {sbodyname, type,staff} = req.body;

        // validation
        
        if(!sbodyname || !staff ||!type)
            return res.status(400).json({errorMessage:"Please Enter all Required fields"});
        const newSociety = new Society({
            sbodyname,type, staff
        });
        const savedSociety = await newSociety.save();
        res.status(200).send("done");

        


    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
    
});
router.post("/events", async (req, res) => {
    try {
        const {societyid} = req.body;
        await Event.find({societyid}).then(function (events) {
            console.log(events);
            res.send(events);
        });

        


    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
    
});
router.post("/addmember", async (req, res) => {
    try {
        const {societyid, uid, post} = req.body;

        // validation
        
        if(!societyid || !uid || !post)
            return res.status(400).json({errorMessage:"Please Enter all Required fields"});


        let user = await User.findById(uid);
        if(!user) return res.json("no user");
        let society = await Society.findById(societyid);
        if(!society) return res.json("no society");
        
        user.societies.push(uid);
        
        society.staff.push({
            "uid":uid,"post":post
        });
        
        const saveduser = await user.save();
        const savedSociety = await society.save();
        res.status(200).send("done");

        


    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
    
});

module.exports =router;