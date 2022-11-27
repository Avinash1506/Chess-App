const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");

const {verifyToken, isNotAuthorized} = require("../controllers/checkAuth.js");

router.post("/newgame", verifyToken, gameController.post_game);

// router.get("/:username1/:username2/:roomid", verifyToken, gameController.get_game);

router.get("/gameDetails/:roomId", verifyToken, gameController.get_game);

router.post("/notifications", verifyToken, gameController.get_notifications);

router.get("/matches/:roomId", verifyToken, gameController.get_match);

router.post("/matches", verifyToken, gameController.get_all_matches);

router.get("/userMatches", verifyToken, gameController.get_matches_of_user);

module.exports = router;