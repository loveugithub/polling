const {
  createPoll,
  findAllPolls,
  findAllPollsByCreatedBy,
  findPoll,
  bulkCreatePollOptions,

  createPollAnswer,
  findPollAnswers,
  findPollByIdAndUserId,
} = require("../../model/polls/poll.model");

const { sequelize } = require("../../services/mysql");
const AppError = require("../../utils/app-error");

exports.add = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { title, description, options } = req.body;
    const { id: createdBy } = req.user;

    if (options.length < 1) {
      return next(new AppError(`options can not be null`, 400));
    }

    const newPoll = await createPoll({ title, description, createdBy }, t);

    const optionsArr = options.map((str) => {
      return { body: str, pollId: newPoll.id };
    });

    await bulkCreatePollOptions(optionsArr, t);

    const poll = await findPoll(newPoll.id, t);

    await t.commit();

    res.status(201).json({
      status: "success",
      data: {
        poll,
      },
    });
  } catch (err) {
    await t.rollback();
    res.status(400).json({
      status: "fail",
      error: err,
    });
  }
};

exports.getAllPolls = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const polls = await findAllPolls(transaction);

    await transaction.commit();
    res.status(200).json({
      status: "success",
      length: polls.length,
      data: {
        polls,
      },
    });
  } catch (err) {
    await transaction.rollback();
    res.status(400).json({
      status: "fail",
      error: err,
    });
  }
};

exports.getAllMyPolls = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id: createdBy } = req.user;
    const polls = await findAllPollsByCreatedBy(createdBy, transaction);

    await transaction.commit();
    res.status(200).json({
      status: "success",
      length: polls.length,
      data: {
        polls,
      },
    });
  } catch (err) {
    await transaction.rollback();
    console.log(err);
    res.status(400).json({
      status: "fail",
      error: err,
    });
  }
};

exports.addAnswer = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { pollId } = req.params;
    const { id: createdBy } = req.user;
    const { optionId: pollOptionId } = req.body;

    const isExist = await findPollByIdAndUserId({ pollId, createdBy }, t);

    if (isExist) {
      return next(new AppError(`answer is already submitted by user!`, 400));
    }

    await createPollAnswer({ pollId, pollOptionId, createdBy }, t);

    const pollAnswers = await findPollAnswers(pollId, t);

    await t.commit();
    res.status(200).json({
      status: "success",
      data: {
        pollAnswers,
      },
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(400).json({
      status: "fail",
      error: err,
    });
  }
};
