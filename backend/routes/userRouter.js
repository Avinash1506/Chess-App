const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

const {verifyToken, isNotAuthorized} = require("../controllers/checkAuth.js");

router.post("/register", isNotAuthorized, userController.post_register);

router.post("/login", isNotAuthorized, userController.post_login);

router.post("/logout", verifyToken, userController.post_logout);

router.post("/search", verifyToken, userController.post_search_user);

router.get("/getUserProfile", verifyToken, userController.search_user_profile);

module.exports = router;