const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {type: String,required:true},
    first_name: {type: String,required:true},
    last_name: {type: String,required:true},
    classs: {type: String,required:true},
    societies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'society'
    }],
    passwordHash: {type: String, required: true},
    isadmin: {type: Boolean, default: false}
});

const User = mongoose.model("user",userSchema);

module.exports = User;