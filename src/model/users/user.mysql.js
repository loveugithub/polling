const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");

const { sequelize } = require("../../services/mysql");

const User = sequelize.define(
  "User",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    fullName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    passwordConfirm: {
      type: Sequelize.VIRTUAL,
      allowNull: false,
      validate: {
        checkPassword(value) {
          if (value !== this.password) {
            throw new Error(`Password and passwordConfirm didn't match`);
          } else {
            this.passwordConfirm = null;
          }
        },
        len: {
          args: [5, 10],
          msg: "Password length must be greater than 4 and less than 11",
        },
      },
    },
  },
  {
    defaultScope: {
      attributes: {
        exclude: ["password"],
      },
    },

    paranoid: true,
    underscored: true,
    tableName: "users",
    indexes: [{ name: "username", fields: ["username"] }],
  }
);

User.beforeCreate(async (publisher) => {
  if (publisher.password) {
    publisher.password = await bcrypt.hash(publisher.password, 12);
  }
});

User.prototype.checkPassword = async function (
  candidatePassword,
  publisherPassword
) {
  console.log("I am in checkPassword function");
  return await bcrypt.compare(candidatePassword, publisherPassword);
};

module.exports = User;
