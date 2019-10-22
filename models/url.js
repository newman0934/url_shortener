const mongoose = require("mongoose")
const Schema =mongoose.Schema
const urlSchema = new Schema({
    short_url: {
        type:String,
        required:true,
        unique: true
    },
    long_url: {
        tpye: String,
        required: true
    }
})

module.exports = mongoose.model("Url","urlSchema")