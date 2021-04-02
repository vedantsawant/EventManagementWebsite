const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {type: String,required:true},
    first_name: {type: String,required:true},
    last_name: {type: String,required:true},
    classs: {type: String,required:true},
    passwordHash: {type: String, required: true},
});

const User = mongoose.model("user",userSchema);

module.exports = User;