const express = require("express");

const { errorHandler } = require("./utils/error-handler");
const api = require("./routes/api");
const AppError = require("./utils/app-error");

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("SERVER is RUNNING"));
app.use("/api/v1", api);
app.all("*", (req, res, next) =>
  next(new AppError(`${req.originalUrl} not found`, 404))
);

app.use(errorHandler);

module.exports = app;
