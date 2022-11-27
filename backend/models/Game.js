const mongoose = require("mongoose");

const Game = new mongoose.Schema({
    user1: {
        type: {},
    },
    user2: {
        type: {},
    },
    url: {
        type: String
    },
    roomId: {
        type: String
    },
    winner: {
        type: String, 
        default: ''
    }, 
    gameStartedAt: {
        type: Date,
    }
});

module.exports = mongoose.model("Game", Game);