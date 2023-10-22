const User = require("./user.mysql");

const createUser = async (body, t) => {
  return await User.create(body, { transaction: t });
};

const findAllUsers = async (filter, t) => {
  return await User.findAll(filter);
};

const findUserById = async (id, t) => {
  if (t) return await User.findOne({ where: { id }, transaction: t });

  return await User.findOne({ where: { id } });
};

const findUserByUsernameIncludedPassword = async (username, t) => {
  return await User.findOne({
    where: { username },
    attributes: { include: ["password"] },
    transaction: t,
  });
};

module.exports = {
  createUser,
  findAllUsers,
  findUserById,
  findUserByUsernameIncludedPassword,
};
