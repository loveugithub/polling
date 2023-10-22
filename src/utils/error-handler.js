const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      err: err.message,
    });
  } else {
    return res.status(400).json({
      status: "fail",
      err,
    });
  }
};

module.exports = { errorHandler };
