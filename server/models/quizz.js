const express = require("express")
const mongoose = require("mongoose")

const schema = mongoose.Schema

const quizzschema = new schema({
    username:{
        type: String,
    },
    quizname:{
        type:String,
    },
    q_no:{
        type:Number,
    }

})

module.exports = mongoose.model("quiz",quizzschema)