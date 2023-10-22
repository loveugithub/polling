const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const { sequelize } = require("../../services/mysql");
const {
  createUser,
  findUserById,
  findUserByUsernameIncludedPassword,
} = require("../../model/users/user.model");
const AppError = require("../../utils/app-error");

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // don't send password & passwordConfirm
  user.password = undefined;
  user.passwordConfirm = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.userSignup = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { fullName, username, password, passwordConfirm } = req.body;
    const newUser = await createUser(
      { fullName, username, password, passwordConfirm },
      t
    );
    const user = await findUserById(newUser.id, t);

    await t.commit();
    createSendToken(user, 201, res);
  } catch (err) {
    await t.rollback();
    res.status(400).json({
      status: "fail",
      error: err,
    });
  }
};

exports.userLogin = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new AppError(`Please provide username and password!`, 400));
    }

    const user = await findUserByUsernameIncludedPassword(username, t);
    if (!user || !(await user.checkPassword(password, user.password))) {
      return next(new AppError(`Incorrect username or password!`, 404));
    }

    await t.commit();
    createSendToken(user, 200, res);
  } catch (err) {
    await t.rollback();
    console.error(err);
    next(err);
  }
};

exports.userLogout = async (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
  });
};

exports.protect = async (req, res, next) => {
  // Check if token is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token || token === "null") {
    return next(new AppError(`You are not logged in`, 401));
  }

  // Verificaton of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //console.log(decoded);

  // check if user still exists
  const user = await findUserById(decoded.id);

  if (!user) {
    return next(
      new AppError(
        `The user belonging to this token does no longer exist.`,
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = user;
  next();
};
