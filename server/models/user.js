const express = require("express")
const mongoose = require("mongoose")

const schema = mongoose.Schema

const userschema = new schema({
    username:{
        type: String,
    },
    first:{
        type:String,
    },
    last:{
        type:String,
    },
    image:{
        type:String,
    }

})

module.exports = mongoose.model("user",userschema)