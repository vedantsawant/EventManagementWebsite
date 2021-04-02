const router = require("express").Router();
const Society = require("../models/societyModel");
const Event = require("../models/EventModel");

router.post("/add", async (req, res) => {
    try {
        const {societyname, staff} = req.body;

        // validation
        
        if(!societyname || !staff)
            return res.status(400).json({errorMessage:"Please Enter all Required fields"});
        const newSociety = new Society({
            societyname, staff
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


module.exports =router;