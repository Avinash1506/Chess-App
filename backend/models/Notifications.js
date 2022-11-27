const mongoose = require("mongoose");

const Notifications = new mongoose.Schema({
    fromUsername: {
        type: String,
    }, 
    toUsername: {
        type: String,
    },
    roomId: {
        type: String,
    },
    gameStartedAt: {
        type: Date
    },
    winner: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model("Notifications", Notifications);