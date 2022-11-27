const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const Move  = require("./models/Move");
const Game = require("./models/Game");
const Rating = require("./models/Rating");
const Notifications = require("./models/Notifications");
const updateRating = require('./helpers/UpdateRating');
const dotenv = require("dotenv");
app.use(express.json());

dotenv.config();

//mongodb connection
const dburl = process.env.db_password;

mongoose.connect(dburl, 
    {useUnifiedTopology: true, useNewUrlParser: true}, 
    (err) => {
        if (err) {
            console.log("Error is ", err);
        } else {
            console.log("Success");
        }
    }    
);
// app.use(cors());

const PORT = process.env.PORT;

const server = app.listen(PORT, () => { 
    console.log("Listnening on", PORT);
});

// updateRating("carlsen01", "kasparov01", "win");

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*"
    },
})

app.get("/delete", async (req, res, next) => {
    await Move.remove({});
    await Game.remove({});
    await Notifications.remove({});

    // await User.remove({});
    await Rating.remove({});

    res.send({message: "success"});
})

const userRouter = require("./routes/userRouter");
const gameRouter = require("./routes/gameRouter");
const User = require("./models/User");

app.use("/user", userRouter);
app.use("/game", gameRouter);
let i = 0;

io.on('connection', (socket) => { 
    // socket.join('abc');
    socket.on('joinroomgame', async (id) => {
        socket.join(id[0]);

        const movesData = await Move.find({roomId: id});

        io.to(id).emit("completed-moves", movesData);
    })

    socket.on('joinroomnotification', async (id) => {
        socket.join(id);
    })

    socket.on('move', async (data) => {
        // store the roomId, username, message, timeStamp in DB
        // console.log(data);
        // console.log("hello");
        const id = data["roomId"];

        if(data['oppositeColor'] === 'black') {
            color = 'white';
        } else {
            color = 'black';
        }

        // console.log(data['board'][data['prevX']][data['prevY']]);
        // console.log(data['board'][data['nextX']][data['nextY']]);
        let killed;
        
        if(data['board'][data['nextX']][data['nextY']].icon !== '') {
            killed = data['board'][data['nextX']][data['nextY']];
        }

        const moveObj = new Move({roomId: id, username: data['username'], color: color, prevX: data['prevX'], prevY: data['prevY'], nextX: data['nextX'], nextY: data['nextY'], killed: killed});
        await moveObj.save();

        // console.log(i++);
        // console.log("hello");
        // console.log(id);
        // var room = io.sockets.adapter.rooms[id];
        // Object.keys(room).length;

        // for (var clientId in clients_in_the_room ) {
        //     console.log('client: %s', clientId); // Seeing is believing
        //     // var client_socket = io.sockets.connected[clientId]; // Do whatever you want with this
        // }
        // console.log(data);
        io.to(id).emit('move', data);
    })

    // socket.on("new-game", (id)=> {
    //     io.to(id).emit("new-game", "start a new game");
    // })
    
    socket.on("game-end", async (data) => {
        const gameData = await Game.findOne({roomId: data['roomId']});

        await Game.updateOne({roomId: data['roomId']}, {$set: {winner: data['winner']}});
        await Notifications.updateOne({roomId: data['roomId']}, {$set: {winner: data['winner']}});
        console.log(data);

        console.log("winner: ", data['winner']);
        console.log("loser: ", data['loser']);

        updateRating(data['winner'], data['loser'], "win", data['roomId']);
        // updateRating("carlsen01", "kasparov01", "win");
    });

    socket.on("notification", (data) => {
        io.to(data.toUsername).emit('shownotification', data);
    });

    socket.on('draw', (data) => {
        console.log("Hello, world!");
        io.to(data['roomId']).emit('draw', {username: data['playerUsername']});
    })
});




