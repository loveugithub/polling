const Poll = require("../../model/polls/poll.mysql");
const PollOption = require("../../model/polls/poll-option.mysql");

// One-to-Many
Poll.hasMany(PollOption, {
  sourceKey: "id",
  foreignKey: "pollId",
});

PollOption.belongsTo(Poll, {
  targetKey: "id",
  foreignKey: "pollId",
});
