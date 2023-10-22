const Poll = require("../../model/polls/poll.mysql");
const User = require("../../model/users/user.mysql");

// One-to-Many
User.hasMany(Poll, {
  sourceKey: "id",
  foreignKey: "createdBy",
});

Poll.belongsTo(User, {
  targetKey: "id",
  foreignKey: "createdBy",
});
