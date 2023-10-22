const express = require("express");

// 1) routers
const userRouter = require("./users/user.router");
const pollRouter = require("./polls/poll.router");

// 2) associations
require("../association/all.association");

const api = express.Router();

api.get("/", (req, res) => res.send("<h1>welcome to APIs!</h1>"));
// users
api.use("/users", userRouter);
// polls
api.use("/polls", pollRouter);

module.exports = api;
