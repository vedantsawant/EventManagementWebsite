const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Society = require("../models/sbodyModel");
const auth = require("../middleware/userauth");

router.post("/register", async (req, res) => {
    try {
        const {email, first_name,last_name, classs , password, passwordVerify} = req.body;
        console.log(req.body);

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
        console.log("Log attempt");
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
        console.log("Logged in");

        res.cookie("token",token,{
            httpOnly:true,
        }).send();




    } catch (error) {
        console.error(err);
        res.status(500).send();
    }
});


router.get("/tokenIsValid", async (req, res)=>{
    try{
        const token = req.cookies.token;
        if(!token) return res.json(false);
        
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        if(!verified) return res.json(false);
        
        const user = await User.findById(verified.user);
        if(!user) return res.json(false);
        
        if(user.societies.length === 0){
            return res.json({
                user: {
                    email : user.email,
                    first_name : user.first_name,
                    last_name:user.last_name,
                    classs:user.classs,
                    
                }});
        }else{
            return res.json({
                user: {
                    email : user.email,
                    first_name : user.first_name,
                    last_name:user.last_name,
                    classs:user.classs,
                    societies:user.societies,
                }});
        }



    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});
router.get("/getallsbody", async (req, res)=>{
    try{
        
        const token = req.cookies.token;
        if(!token) return res.json(false);
        
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        if(!verified) return res.json(false);
        
        const user = await User.findById(verified.user);
        if(!user) return res.json(false);
        
        if(user.societies.length === 0){
            return res.json(false);
        }else{
            societies =[];
            
            for(var i =0;i<user.societies.length;i++){
                
                let society = await Society.findById(user.societies[i]);
                
                
                if(society){
                    societyvar ={
                        "id":user.societies[i], "name":society.sbodyname
                    };
                    societies.push(societyvar);
                }
            }
            
            return res.json({
                societies: societies
            });
        }



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