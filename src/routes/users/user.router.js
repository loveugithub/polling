const express = require("express");

const {
  protect,
  userSignup,
  userLogin,
  userLogout,
} = require("./auth.controller");
const { getMe } = require("./user.controller");
// const {} = require("./user.controller");

const userRouter = express.Router();

userRouter.post("/signup", userSignup);
userRouter.post("/login", userLogin);
userRouter.get("/logout", userLogout);

// protected routes
// userRouter.use(protect);
userRouter.get("/me", protect, getMe);

module.exports = userRouter;
