const mongoose = require("mongoose");

module.exports = {
  promise: new Promise(async (resolve, reject) => {
    mongoose.set("useCreateIndex", true);
    console.log("Connecting to MongoDB...");
    await mongoose.connect(
      `mongodb://${process.env.MONGO_URL}/${process.env.MONGO_DB}?authSource=admin`,
      {
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PW,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
    console.log("Connected to MongoDB!");

    resolve(mongoose.connection);
  }),
  conn: mongoose.connection,
};
