const express = require("express");
const {
  add,
  getAllPolls,
  getAllMyPolls,
  addAnswer,
} = require("./poll.controller");
const { protect } = require("../users/auth.controller");

const pollRouter = express.Router();

pollRouter.post("/", protect, add);
pollRouter.get("/", protect, getAllPolls);
pollRouter.get("/me", protect, getAllMyPolls);
pollRouter.post("/:pollId/answer", protect, addAnswer);

module.exports = pollRouter;
