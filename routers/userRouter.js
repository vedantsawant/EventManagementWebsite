const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/userauth");

router.post("/", async (req, res) => {
    try {
        const {email, first_name,last_name, classs , password, passwordVerify} = req.body;

        // validation
        
        if(!email || !first_name || !last_name  || !classs || !password || !passwordVerify)
            return res.status(400).json({errorMessage:"Please Enter all Required fields"});
        
        if(password.length < 6)
            return res.status(400).json({errorMessage:"Please Enter password with atleast 6 characters"});
        if(password !== passwordVerify)
            return res.status(400).json({errorMessage:"Password Dont Match"});

        const existingUser = await User.findOne({email:email});

        if(existingUser){
            return res.status(400).json({errorMessage:"Account already exists"});
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);

        // save suer account 

        const newUser = new User({
            email,first_name,last_name,classs,passwordHash
        });
        const savedUser = await newUser.save();

        //log user in 

        const token = jwt.sign({
            user: savedUser._id
        },process.env.JWT_SECRET);

        res.cookie("token",token,{
            httpOnly:true,
        }).send();


    } catch (error) {
        console.error(err);
        res.status(500).send();
    }
    
});




// log in

router.post("/login",async (req,res) => {
    try {
        const {email, password} = req.body;
        //validate
        if(!email || !password)
            return res.status(400).json({errorMessage:"Please Enter all Required fields"});
        
        //find user in database
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(401).json({errorMessage:"wrong email or password"});
        }
        const passwordCorrect = await bcrypt.compare(password,existingUser.passwordHash);
        if(!passwordCorrect){
            return res.status(401).json({errorMessage:"wrong email or password"});
        }
        const token = jwt.sign({
            user: existingUser._id
        },process.env.JWT_SECRET);

        res.cookie("token",token,{
            httpOnly:true,
        }).send();




    } catch (error) {
        console.error(err);
        res.status(500).send();
    }
});


router.post("/tokenIsValid", async (req, res)=>{
    try{
        const token = req.cookies.token;
        if(!token) return res.json(false);
        
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        if(!verified) return res.json(false);
        
        const user = await User.findById(verified.user);
        if(!user) return res.json(false);
    
        return res.json({
            user: {
                email : user.email,
                first_name : user.first_name,
                last_name:user.last_name,
                classs:user.classs,
            }});

    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});


// log out

router.get("/logout",(req,res)=>{
    res.cookie("token","",{
        httpOnly:true,
        expires: new Date(0)
    }).send();
});


module.exports =router;