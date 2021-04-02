const mongoose = require("mongoose");

const societySchema = new mongoose.Schema({
    societyname: {type: String,required:true},
    staff: [{ uid: {type: mongoose.Schema.Types.ObjectId,
        ref: 'user'}, post: String }]
});

const Society = mongoose.model("society",societySchema);

module.exports = Society;