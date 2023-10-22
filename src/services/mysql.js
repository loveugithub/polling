const { Sequelize } = require("sequelize");

const URI = process.env.MYSQL_URI;
const sequelize = new Sequelize(URI);

const connectDB = async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  // await sequelize.sync({ force: true });
  console.log("Connection has been established successfully.");
};

module.exports = { connectDB, sequelize };
