const Sequelize = require("sequelize");

const { sequelize } = require("../../services/mysql");

const PollOption = sequelize.define(
  "PollOption",
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
    },
    body: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    underscored: true,
    tableName: "polls_options",
  }
);

module.exports = PollOption;
