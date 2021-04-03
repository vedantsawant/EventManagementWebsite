const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    societyid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'society',
        required:true
    },
    description: {type: String, required: true},
    registered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    }],
    approved: {type: Number, default: 0},
    productImageName:{type:String,default:"none",required:true},
    productImageData: {type:String,required:true},
});

const Event = mongoose.model("event",eventSchema);

module.exports = Event;