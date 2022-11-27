const Game = require("../models/Game.js");
const { v4: uuidv4 } = require('uuid');
const Notifications = require("../models/Notifications.js");
const Move = require("../models/Move.js");

module.exports.post_game = async (req, res, next) => {
    console.log("post_game body: ", req.body);
    const users = req.body.users; 
    const gameFromDb = await Game.findOne({$and: [{"user1.username": {$in: users}}, {"user2.username": {$in: users}}, {winner: ''}]});

    if(gameFromDb) {
        console.log("Hello-1");
        return res.send({message: "success", url: gameFromDb.roomUrl, user1: gameFromDb.user1, user2: gameFromDb.user2, roomId: gameFromDb.roomId, gameStartedAt: gameFromDb.gameStartedAt});
    } else {
        console.log("Hello-2");
        const roomId = uuidv4(); 
        const url = `/${users[0]}/${users[1]}/${roomId}`;

        console.log(url)

        const user1 = {username: users[0], color: 'white'};
        const user2 = {username: users[1], color: 'black'};
        const startedAt = req.body.time;

        const gameObj = new Game({url: url, user1: user1, user2: user2, roomId: roomId, gameStartedAt: startedAt});

        await gameObj.save();

        const notificationsObj = new Notifications({fromUsername: users[0], toUsername: users[1], roomId: roomId, gameStartedAt: startedAt});

        await notificationsObj.save();

        res.send({message: "success", url: url, user1: user1, user2: user2, roomId: roomId, gameStartedAt: startedAt});
    }
}

module.exports.get_game = async (req, res) => {
    const gameObj = await Game.findOne({roomId: req.params.roomId});

    res.send({message: "success", gameObj: gameObj});
}

module.exports.get_notifications = async (req, res) => {

    console.log(req.body);

    let {filterBasedOn, page, limit, status} = req.body;

    console.log(req.body);

    if(filterBasedOn === '-startedAt') {
        console.log("negative");
        filterBasedOn = {"gameStartedAt": -1};
    } else if(filterBasedOn === '+startedAt') {
        console.log("positive");
        filterBasedOn = {"gameStartedAt": 1};
    }

    let winner = '', data, noOfNotifications;

    if(status === 'active') {
        data = await Notifications.find({$and: [{$or: [{toUsername: req.username}, {fromUsername: req.username}]}, {winner: ''}]}).skip((page - 1) * limit).limit(limit).sort(filterBasedOn);
        noOfNotifications = await Notifications.find({$and: [{$or: [{toUsername: req.username}, {fromUsername: req.username}]}, {winner: ''}]}).count();
    } else if(status === 'finished') {
        data = await Notifications.find({$and: [{$or: [{toUsername: req.username}, {fromUsername: req.username}]}, {winner: {$ne: ''}}]}).skip((page - 1) * limit).limit(limit).sort(filterBasedOn);
        noOfNotifications = await Notifications.find({$and: [{$or: [{toUsername: req.username}, {fromUsername: req.username}]}, {winner: {$ne: ''}}]}).count();
    } else {
        data = await Notifications.find({$or: [{toUsername: req.username}, {fromUsername: req.username}]}).skip((page - 1) * limit).limit(limit).sort(filterBasedOn);
        noOfNotifications = await Notifications.find({$or: [{toUsername: req.username}, {fromUsername: req.username}]}).count();
    }

    let pagesCnt = Math.floor(noOfNotifications / limit) + (noOfNotifications % limit !== 0);

    console.log("notifications: ", data);

    res.send({message: "success", notifications: data, pagesCnt: pagesCnt});
}

module.exports.get_all_matches = async (req, res) => {

    let {filterBasedOn, page, limit, winner} = req.body;

    if(filterBasedOn === '-startedAt') {
        console.log("negative");
        filterBasedOn = {"gameStartedAt": -1};
    } else if(filterBasedOn === '+startedAt') {
        console.log("positive");
        filterBasedOn = {"gameStartedAt": 1};
    }

    let data; 

    if(winner === 'self') {
        data = await Game.find({$and: [{$or: [{"user1.username": req.username}, {"user2.username": req.username}]}, {winner: req.username}]}).skip((page - 1) * limit).limit(limit).sort(filterBasedOn);
        // data = await Notifications.find({$and: [{$or: [{toUsername: req.username}, {fromUsername: req.username}]}, {winner: ''}]}).skip((page - 1) * limit).limit(limit).sort(filterBasedOn);
        noOfNotifications = await Game.find({$and: [{$or: [{"user1.username": req.username}, {"user2.username": req.username}]}, {winner: req.username}]}).count();
    } else if(winner === 'opponent') {
        data = await Game.find({$and: [{$or: [{"user1.username": req.username}, {"user2.username": req.username}]}, {winner: {$ne: req.username}}, {winner: {$ne: ''}}]}).skip((page - 1) * limit).limit(limit).sort(filterBasedOn);
        noOfNotifications = await Game.find({$and: [{$or: [{"user1.username": req.username}, {"user2.username": req.username}]}, {winner: {$ne: req.username}}, {winner: {$ne: ''}}]}).count();
    } else {
        data = await Game.find({$and: [{$or: [{"user1.username": req.username}, {"user2.username": req.username}]}, {winner: {$ne: ''}}]}).skip((page - 1) * limit).limit(limit).sort(filterBasedOn);
        noOfNotifications = await Game.find({$and: [{$or: [{"user1.username": req.username}, {"user2.username": req.username}]}, {winner: {$ne: ''}}]}).count();
    }

    let pagesCnt = Math.floor(noOfNotifications / limit) + (noOfNotifications % limit !== 0);

    // const games = await Game.find({$and: [{$or: [{"user1.username": req.username}, {"user2.username": req.username}]}, {winner: {$ne: ''}}]})

    res.send({message: "success", completedGames: data, pagesCnt: pagesCnt});

    // await Move.find({})

    // const completedGames = {};

    // for(let game of games) {
    //     const moveObj = await Move.find({roomId: game.roomId});

    //     if(completedGames[game.roomId]) {
    //         completedGames[game.roomId].push(moveObj);
    //     } else {
    //         completedGames[game.roomId] = moveObj;
    //     }
    // }
}

module.exports.get_match = async (req, res) => {
    const roomId = req.params.roomId;

    const moves = await Move.find({roomId: roomId});

    res.send({message: "success", moves: moves});
}

module.exports.get_matches_of_user = async (req, res) => {
    const username = req.username;

    const gameData = await Game.find({$or: [{"user1.username": username}, {"user2.username": username}]});

    res.send({message: "success", data: gameData});
}