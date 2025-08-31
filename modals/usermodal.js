const Schema = require("mongoose").Schema;
const mongoose = require("mongoose");

const userSchema = new Schema({
    Name : {
        type : String,
        required : true
    },
    Age : {
        type : Number,
        required : false
    },
    Email : {
        type : String,
        required : true,
        unique : true
    },
    Password : {
        type : String,
        required : true
    },
    Date : {
        type : Date,
        default : Date.now
    },
    Verified : {
        type : Boolean,
        default : false
    }
})

module.exports = mongoose.model("user",userSchema);