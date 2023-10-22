const Sequelize = require("sequelize");

const { sequelize } = require("../../services/mysql");

const PollAnswer = sequelize.define(
  "PollAnswer",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    pollId: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: "pollId-userId",
    },
    pollOptionId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    createdBy: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: "pollId-userId",
    },
  },
  {
    paranoid: true,
    underscored: true,
    tableName: "polls_answers",
  }
);

module.exports = PollAnswer;
