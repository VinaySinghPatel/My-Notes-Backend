const Schema = require("mongoose").Schema;
const mongoose = require("mongoose");

const notesSchema = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },
    Type : {
        type : String,
        required : true
    },
    Note : {
        type : String,
        required : true
    },
     Date : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model("notes",notesSchema);