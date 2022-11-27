const mongoose = require("mongoose");

const Move = new mongoose.Schema({
    roomId: {
        type: String
    },
    username: {
        type: String 
    },
    color: {
        type: String
    },
    prevX: {
        type: Number
    },
    prevY: {
        type: Number
    },
    nextX: {
        type: Number
    },
    nextY: {
        type: Number
    },
    killed: {
        type: Object,
        default: {icon: '', color: '', piece: ''}
    }
});

module.exports = mongoose.model("Move", Move);