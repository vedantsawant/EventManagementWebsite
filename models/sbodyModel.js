const mongoose = require("mongoose");

const sbodySchema = new mongoose.Schema({
    sbodyname: {type: String,required:true},
    type: {type: String,required:true},
    staff: [{ uid: {type: mongoose.Schema.Types.ObjectId,
        ref: 'user'}, post: String }]
});

const Sbody = mongoose.model("sbody",sbodySchema);

module.exports = Sbody;