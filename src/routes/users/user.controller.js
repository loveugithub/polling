const { sequelize } = require("../../services/mysql");

const { findUserById } = require("../../model/users/user.model");
const AppError = require("../../utils/app-error");

exports.getMe = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.user;

    const user = await findUserById(id, t);

    await t.commit();
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    t.rollback();
    console.error(err);
    next(err);
  }
};
