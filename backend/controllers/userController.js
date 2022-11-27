const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Game = require("../models/Game");
const Rating = require("../models/Rating");

module.exports.post_register = async (req, res, next) => {
    // console.log(req.body);

    const {email, password, name, username} = req.body;

    if(email === '') {
        return res.send({message: "input fields are incomplete", isLoggedIn: false, username: username, email: email, name: name});
    }

    if(password === '') {
        return res.send({message: "input fields are incomplete", isLoggedIn: false, username: username, email: email, name: name});
    }

    if(username === '') {
        return res.send({message: "input fields are incomplete", isLoggedIn: false, username: username, email: email, name: name});
    }

    if(name === '') {
        return res.send({message: "input fields are incomplete", isLoggedIn: false, username: username, email: email, name: name});
    }

    // console.log("Hello in register");

    try {
        dataBasedOnEmail = await User.findOne({email: email}).exec();
    } catch(e) {
        console.log("Error: ", e);
    }

    if(dataBasedOnEmail !== null) {
        return res.send({message: "Email already exists", isLoggedIn: false,  username: username, email: email, name: name });
    }

    else {

        try {
            dataBasedOnUsername = await User.findOne({username: username}).exec();
        } catch(e) {
            console.log("Error: ", e);
        } 

        if(dataBasedOnUsername !== null) {
            return res.send({message: "Username already exists", isLoggedIn: false,  "username": username, "email": email, "name": name});
        }   
        else {

            let hashedPassword;

            try {
                hashedPassword = await bcrypt.hash(password, 10);
            } catch(e) {
                console.log("Error: ", e);
            }

            const userData = new User({username: username, password: hashedPassword, email: email, name: name})

            try {
                await userData.save()
            } catch(e) {
                console.log("Error: ", e);
            }

            return res.send({message: "success", isLoggedIn: false});
        }
    }

    // res.send({"message": "Registration Success"});
}

module.exports.post_login = async (req, res) => {
    const {username ,password} = req.body;

    const userDataFromDb = await User.findOne({username: username});

    if(userDataFromDb) {
        const passwordsMatch = await bcrypt.compare(password, userDataFromDb.password)
        if(passwordsMatch) {
            let signedtoken = await jwt.sign(
                { username: username },
                "avi314299"
            );
            res.send({
                message: "success",
                jwt: signedtoken,
                userdata: username,
            });
        } else {
            res.send({message: "password is incorrect"});    
        }
    } else {
        res.send({message: "user doesn't exist"});
    }
}

module.exports.post_logout = async (req, res) => {
    res.send({message: "successs"});
}

module.exports.post_search_user = async (req, res, next) => {
    console.log("Hello");
    const searchValue  = req.body.searchValue;

    console.log("search value: ", searchValue);

    const data = await User.find({name: {$regex: searchValue, $options: 'i'}});

    console.log(data);

    res.send({message: "success", userData: data});
}

module.exports.search_user_profile = async (req, res) => {
    const username = req.username;

    const userData = await User.findOne({username: username});

    const won = await Game.find({
        $and: [
            {
                $or: [
                    {"user1.username": username},
                    {"user2.username": username}
                ]
            }, 
            {
                winner: username
            }
        ]
    }).count();

    const lost = await Game.find({
        $and: [
            {
                $or: [
                    {"user1.username": username},
                    {"user2.username": username}
                ]
            }, 
            {
                $and: [
                    {winner: {$ne: username}},
                    {winner: {$ne: ''}}
                ]
            }
        ]
    }).count();

    const rating = await Rating.find({username: username});

    console.log(rating);

    res.send({userData: userData, matchesWon: won, matchesLost: lost, matchesPlayed: won + lost, rating: rating, message: "success"});
}