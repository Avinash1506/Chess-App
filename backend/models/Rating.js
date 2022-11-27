const mongoose = require("mongoose");

const Rating = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    RD: {
        type: Number,
        required: true
    },
    roomId: {
        type: String,
        unique: true, 
        required: true
    }
});

module.exports = mongoose.model("Rating", Rating);