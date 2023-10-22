const Poll = require("../../model/polls/poll.mysql");
const PollOption = require("../../model/polls/poll-option.mysql");
const PollAnswer = require("../../model/polls/poll-answer.mysql");
const User = require("../../model/users/user.mysql");

// 1)
Poll.hasMany(PollAnswer, {
  sourceKey: "id",
  foreignKey: "pollId",
});

PollAnswer.belongsTo(Poll, {
  targetKey: "id",
  foreignKey: "pollId",
});

// 2)
PollOption.hasMany(PollAnswer, {
  sourceKey: "id",
  foreignKey: "pollOptionId",
});

PollAnswer.belongsTo(PollOption, {
  targetKey: "id",
  foreignKey: "pollOptionId",
});

// 3)

User.hasMany(PollAnswer, {
  sourceKey: "id",
  foreignKey: "createdBy",
});

PollAnswer.belongsTo(User, {
  targetKey: "id",
  foreignKey: "createdBy",
});
