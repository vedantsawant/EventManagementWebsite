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
});

const Event = mongoose.model("event",eventSchema);

module.exports = Event;