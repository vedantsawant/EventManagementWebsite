const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    sbodyid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'society',
        required:true
    },
    eventdate: {type: Date, required: true},
    eventname: {type: String, required: true},
    description: {type: String, required: true},
    registered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
        
    }],
    venue:{type: String, required: true},
    approved: {type: Number, default: 0},
    postername:{type:String,default:"none",required:true},
    poster: {type:String,required:true},
});

const Event = mongoose.model("event",eventSchema);

module.exports = Event;