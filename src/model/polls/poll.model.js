const Poll = require("./poll.mysql");
const PollOption = require("./poll-option.mysql");
const PollAnswer = require("./poll-answer.mysql");
const { Sequelize } = require("sequelize");

const createPoll = async (body, t) => {
  return await Poll.create(body, { transaction: t });
};

const findAllPolls = async (t) => {
  return await Poll.findAll({
    include: [
      {
        model: PollOption,
        attributes: ["id", "body"],
      },
    ],
    transaction: t,
  });
};

const findAllPollsByCreatedBy = async (createdBy, t) => {
  return await Poll.findAll({
    where: { createdBy },
    include: [
      {
        model: PollOption,
        attributes: ["id", "body"],
      },
    ],
    transaction: t,
  });
};

const findPoll = async (pollId, t) => {
  return await Poll.findByPk(pollId, {
    include: [
      {
        model: PollOption,
      },
    ],
    transaction: t,
  });
};

const bulkCreatePollOptions = async (body, t) => {
  await PollOption.bulkCreate(body, { transaction: t });
};

const createPollAnswer = async (body, t) => {
  return await PollAnswer.create(body, { transaction: t });
};

const findPollAnswers = async (pollId, t) => {
  return await PollAnswer.findAll({
    where: { pollId },
    attributes: [
      "pollOptionId",
      [Sequelize.fn("COUNT", Sequelize.col("created_by")), "count"],
    ],

    include: [
      {
        model: PollOption,
        attributes: ["body"],
      },
    ],
    group: "pollOptionId",
    transaction: t,
  });
};

const findPollByIdAndUserId = async (data, t) => {
  const { pollId, createdBy } = data;
  return await PollAnswer.findOne({
    where: { pollId, createdBy },
    transaction: t,
  });
};

module.exports = {
  createPoll,
  findAllPolls,
  findAllPollsByCreatedBy,
  findPoll,

  bulkCreatePollOptions,

  createPollAnswer,
  findPollAnswers,
  findPollByIdAndUserId,
};
