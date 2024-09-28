const express = require("express");
const UserController = require('../controllers/UserController')
const route = express.Router();
const checkUserAuth = require('../middleware/auth')


route.post("/register", UserController.registerUser);
route.get('/getUser',checkUserAuth,UserController.getUser);
route.post("/login", UserController.login);
route.get('/logout',UserController.logout);

module.exports = route;