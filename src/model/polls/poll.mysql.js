const Sequelize = require("sequelize");

const { sequelize } = require("../../services/mysql");

const Poll = sequelize.define(
  "Poll",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    createdBy: {
      type: Sequelize.UUID,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    underscored: true,
    tableName: "polls",
  }
);

module.exports = Poll;
